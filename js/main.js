const three = new Threestrap.Bootstrap();

let renderer = three.renderer;
let scene = three.scene;
let camera = three.camera;

let num_rots = 10,
    isMouseDown, onMouseDownPosition = new THREE.Vector2(),
    camera_radius = 2.5, theta = 45, phi = 60, 
    onMouseDownTheta = 45, onMouseDownPhi = 60;

init(num_rots);
render();

function init(num_rots) {
    // Sphere wireframe
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const wireframe = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.10;
    line.material.transparent = true;
    scene.add(line);

    let rots = random_rotations_yana(num_rots);
    // rots.matMul(rots.transpose([0, 2, 1])).print(); // Debug: This should be I
    let axes_list = batch_rotation_to_axes(rots.dataSync(), num_rots, 0.05);
    axes_list.map( e => scene.add(e) );

    // Camera
    const pos = ang_to_xyz(theta, phi);
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.setAnimationLoop(spin_camera);
}

function spin_camera() {
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

// Returns: nums of Matrix3
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
    renderer.setAnimationLoop(null);
}

function onDocumentMouseMove( event ) {
    event.preventDefault();
    if ( isMouseDown ) {
        theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
        phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
        phi = Math.min( 180, Math.max( 0, phi ) );

        const pos = ang_to_xyz(theta, phi);
        camera.position.set(pos.x, pos.y, pos.z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.lookAt(new THREE.Vector3());
        camera.updateMatrix();
    }
    render();
}

function onDocumentMouseUp( event ) {
    event.preventDefault();
    isMouseDown = false;
    onMouseDownPosition.x = event.clientX - onMouseDownPosition.x;
    onMouseDownPosition.y = event.clientY - onMouseDownPosition.y;
    // renderer.setAnimationLoop(spin_camera); 
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false );
document.getElementById('refresh').addEventListener(
    'click', (event) => {
        let num_rots = parseInt(document.getElementById('num_rots').value);
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }
        init(num_rots);
        render();
    });