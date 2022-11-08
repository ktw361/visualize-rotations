const three = new Threestrap.Bootstrap();

let renderer = three.renderer;
let scene = three.scene;
let camera = three.camera;

let isMouseDown, onMouseDownPosition = new THREE.Vector2(),
    camera_radius = 2.5, theta = 45, phi = 60,
    onMouseDownTheta = 45, onMouseDownPhi = 60;
let isSpinCamera;

let method = 'avro';
display_avro();

function init() {
    // Sphere wireframe
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.10;
    line.material.transparent = true;
    scene.add(line);

    let rots, axes_list;
    if (method == 'avro') {
        let num_rots = parseInt(document.getElementById('num_rots').value);
        rots = random_rotations_yana(num_rots);
        axes_list = batch_rotation_to_axes(rots.dataSync(), num_rots, 0.05);
        axes_list.map( e => scene.add(e) );
    } else if (method == 'spiral') {
        let num_sphere_pts = parseInt(document.getElementById('num_sphere_pts').value);
        let num_xy_rots = parseInt(document.getElementById('num_xy_rots').value);
        rots = grid_rotations_spiral(num_sphere_pts, num_xy_rots);
        axes_list = batch_rotation_to_axes(rots.dataSync(), num_sphere_pts * num_xy_rots, 0.05);
        axes_list.map( e => scene.add(e) );
    }
    // rots.matMul(rots.transpose([0, 2, 1])).print(); // Debug: This should be I

    // Camera
    const pos = ang_to_xyz(theta, phi);
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    isSpinCamera = true;
    renderer.setAnimationLoop(spin_camera);
}

function spin_camera() {
    if (!isSpinCamera)
        return;
    var t = three.Time.now * Math.PI * 10;
    const pos = ang_to_xyz(t, -60);
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(new THREE.Vector3());
}

function render() {
    renderer.render(scene, camera);
}

// Input: Array of 9
// Output: AxesHelper
function rotation_to_axes(rot_mat, size) {
    // Tranform = [R | -z]
    const axesHelper = new THREE.AxesHelper(size);
    let T = new THREE.Matrix4();
    T.set(
        rot_mat[0], rot_mat[1], rot_mat[2], - rot_mat[2],
        rot_mat[3], rot_mat[4], rot_mat[5], - rot_mat[5],
        rot_mat[6], rot_mat[7], rot_mat[8], - rot_mat[8],
    );
    axesHelper.applyMatrix4(T);
    return axesHelper;
}
// Input: Array of Nx9
// Output: Array of N AxesHelpers
function batch_rotation_to_axes(rot_mats, nums, size) {
    let res = [];
    for (let i = 0; i < nums; ++i) {
        res.push( rotation_to_axes(rot_mats.slice(9*i, 9*i+9), size) );
    }
    return res;
}

/** Algorithms
// Returns: nums of Matrix3
***/

function random_rotations_yana(nums) {
    let tau = tf.scalar(2 * Math.PI);
    let x1 = tf.randomUniform([nums], 0, 1);
    let x2 = tf.randomUniform([nums], 0, 1);
    let x3 = tf.randomUniform([nums], 0, 1);
    let R = tf.stack(
        [
            tf.stack([tf.cos(tf.mul(tau, x1)), tf.sin(tf.mul(tau, x1)), tf.zeros([nums])], 1),
            tf.stack([tf.sin(tf.mul(tau, x1).mul(-1)), tf.cos(tf.mul(tau, x1)), tf.zeros([nums])], 1),
            tf.stack([tf.zeros([nums]), tf.zeros([nums]), tf.ones([nums])], 1),
        ], 1);
    let v = tf.stack(
        [
            tf.cos(x2.mul(tau)).mul(tf.sqrt(x3)),
            tf.sin(x2.mul(tau)).mul(tf.sqrt(x3)),
            tf.sqrt(x3.mul(-1).add(1)),
        ], 1)
    let identity = tf.eye(3, 3, [nums]);
    let v_aux = v.expandDims(2).mul(2).mul(v.expandDims(1));
    let H = identity.sub(v_aux);
    let rot_mats = tf.matMul(H, R).mul(-1);
    return rot_mats;
}

function grid_rotations_spiral(num_sphere_pts, num_xy_rots) {
    function normalize(pts) {
        return pts.div(tf.norm(pts, 2, 1, true));
    }
    function cross(a, b) {
        let [a1, a2, a3] = tf.split(a, 3, 1);
        let [b1, b2, b3] = tf.split(b, 3, 1);
        let c1 = a2.mul(b3).sub(a3.mul(b2));
        let c2 = a3.mul(b1).sub(a1.mul(b3));
        let c3 = a1.mul(b2).sub(a2.mul(b1));
        return tf.concat([c1, c2, c3], 1);
    }
	let epsilon;
    let n = num_sphere_pts;
    if (n >= 600000) {
        epsilon = 214;
    } else if (n>= 400000) {
        epsilon = 75;
    } else if (n>= 11000) {
        epsilon = 27;
    } else if (n>= 890) {
        epsilon = 10;
    } else if (n>= 177) {
        epsilon = 3.33;
    } else if (n>= 24) {
        epsilon = 1.33;
    } else {
        epsilon = 0.33;
    }

    const goldenRatio = (1 + 5**0.5)/2;
    const i = tf.range(0, n);
    const theta = i.mul(2 * Math.PI / goldenRatio);
    const phi = tf.acos( i.add(epsilon).mul(-2/(n-1+2*epsilon)).add(1) ); // TODO
    const x = tf.cos(theta).mul(tf.sin(phi));
    const y = tf.sin(theta).mul(tf.sin(phi));
    const z = tf.cos(phi);
    const z_vecs = tf.stack([x, y, z], 1)

    const up_vecs = tf.stack([tf.zeros([n]), tf.ones([n]), tf.zeros([n])], 1);
    const y_vecs = normalize( cross(z_vecs, up_vecs) );
    const x_vecs = normalize( cross(y_vecs, z_vecs) );
    let Rz = tf.stack([x_vecs, y_vecs, z_vecs], dim=1)  // (num_sphere_pts, 3, 3)

    const rads = tf.range(0, num_xy_rots).mul(2*Math.PI/num_xy_rots);
    let Rxy = tf.stack([
        tf.stack([tf.cos(rads), tf.sin(rads), tf.zeros([num_xy_rots])], 1),
        tf.stack([tf.sin(rads).mul(-1), tf.cos(rads), tf.zeros([num_xy_rots])], 1),
        tf.stack([tf.zeros([num_xy_rots]), tf.zeros([num_xy_rots]), tf.ones([num_xy_rots])], 1),
    ], 1)

    let num_rots = num_sphere_pts * num_xy_rots;
    Rxy = Rxy.expandDims(1).tile([1, num_sphere_pts, 1, 1]).reshape([num_rots, 3, 3])
    Rz = Rz.expandDims(0).tile([num_xy_rots, 1, 1, 1]).reshape([num_rots, 3, 3])
    // const rot_mats = Rxy.matMul(Rz);
    const rot_mats = Rz.matMul(Rxy);
    return rot_mats;
}
// grid_rotations_spiral(2, 2).print();

// Returns: nums of Matrix3
function random_rotations_spiral(nums) {
    let tau = tf.scalar(2 * Math.PI);
    let x1 = tf.randomUniform([nums], 0, 1);
    let x2 = tf.randomUniform([nums], 0, 1);
    let x3 = tf.randomUniform([nums], 0, 1);
    let R = tf.stack(
        [
            tf.stack([tf.cos(tf.mul(tau, x1)), tf.sin(tf.mul(tau, x1)), tf.zeros([nums])], 1),
            tf.stack([tf.sin(tf.mul(tau, x1).mul(-1)), tf.cos(tf.mul(tau, x1)), tf.zeros([nums])], 1),
            tf.stack([tf.zeros([nums]), tf.zeros([nums]), tf.ones([nums])], 1),
        ], 1);
    let v = tf.stack(
        [
            tf.cos(x2.mul(tau)).mul(tf.sqrt(x3)),
            tf.sin(x2.mul(tau)).mul(tf.sqrt(x3)),
            tf.sqrt(x3.mul(-1).add(1)),
        ], 1)
    let identity = tf.eye(3, 3, [nums]);
    let v_aux = v.expandDims(2).mul(2).mul(v.expandDims(1));
    let H = identity.sub(v_aux);
    let rot_mats = tf.matMul(H, R).mul(-1);
    return rot_mats;
}

function ang_to_xyz(theta, phi) {
    let vec = new THREE.Vector3();
    vec.x = camera_radius * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    vec.y = camera_radius * Math.sin(phi * Math.PI / 360);
    vec.z = camera_radius * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
    return vec;
}

function onDocumentMouseDown( event ) {
    // event.preventDefault();
    isMouseDown = true;
    onMouseDownTheta = theta;
    onMouseDownPhi = phi;
    onMouseDownPosition.x = event.clientX;
    onMouseDownPosition.y = event.clientY;
    isSpinCamera = false;
    // renderer.setAnimationLoop(null);
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    if ( isMouseDown ) {
        theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
        phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
        phi = Math.min( 180, Math.max( 0, phi ) );

        const pos = ang_to_xyz(theta, phi);
        camera.position.set(pos.x, pos.y, pos.z);
        camera.lookAt(new THREE.Vector3());
        // camera.updateMatrix();
    }
    render();
}

function onDocumentMouseUp( event ) {
    event.preventDefault();
    isMouseDown = false;
    onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
    onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false );
document.addEventListener( 'mousewheel', (event) => {
    camera_radius += event.deltaY / 500;
    if (isSpinCamera) {
        ;
    } else {
        const pos = ang_to_xyz(theta, phi);
        camera.position.set(pos.x, pos.y, pos.z);
        camera.lookAt(new THREE.Vector3());
        // camera.updateMatrix();
        render();
    }
});
function display_avro() {
    // <label for="num_rots">Number of Rotations:</label>
    // <input type="text" id="num_rots" name="num_rots" value=100>
    // <button type="button" id="refresh"> Refresh </button>
    const body = document.getElementById('options');
    body.textContent = "";
    const lab = document.createElement('label');
    lab.htmlFor = 'num_rots';
    lab.textContent = "Number of Rotations:";
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = 'num_rots';
    inp.name = 'num_rots';
    inp.value = '100';
    const but = document.createElement('button');
    but.type = 'button';
    but.id = 'refresh';
    but.textContent = 'Refresh';
    but.addEventListener('click', (e) => {
        reset_all();
    });
    body.appendChild(lab);
    body.appendChild(inp);
    body.appendChild(but);

    reset_all();
}
function display_spiral() {
    const body = document.getElementById('options');
    body.textContent = "";

    const lab1 = document.createElement('label');
    lab1.htmlFor = 'num_sphere_pts';
    lab1.textContent = "Number of Sphere Points:";
    const inp1 = document.createElement('input');
    inp1.type = 'text';
    inp1.id = 'num_sphere_pts';
    inp1.name = 'num_sphere_pts';
    inp1.value = '2';

    const lab2 = document.createElement('label');
    lab2.htmlFor = 'num_xy_rots';
    lab2.textContent = "Number of XY Rotations:";
    const inp2 = document.createElement('input');
    inp2.type = 'text';
    inp2.id = 'num_xy_rots';
    inp2.name = 'num_xy_rots';
    inp2.value = '2';

    const but = document.createElement('button');
    but.type = 'button';
    but.id = 'refresh';
    but.textContent = 'Refresh';
    but.addEventListener('click', (e) => {
        reset_all();
    });
    body.appendChild(lab1);
    body.appendChild(inp1);
    body.appendChild(document.createElement('br'));
    body.appendChild(lab2);
    body.appendChild(inp2);
    body.appendChild(but);

    reset_all();
}
function render_options(sel) {
    if (sel.value == 'avro') {
        method = 'avro';
        display_avro();
    } else if (sel.value == 'spiral') {
        method = 'spiral';
        display_spiral();
    }
}
function reset_all() {
    while(scene.children.length > 0){
        scene.remove(scene.children[0]);
    }
    init();
    render();
}
