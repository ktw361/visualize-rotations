import * as tf from '@tensorflow/tfjs'

/** Signature of Algorithms
 *Returns: nums of Matrix3
 **/

function random_rotations_avro(nums) {
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

    const goldenRatio = 1.618033988749895; // (1 + 5**0.5)/2;
    const i = tf.range(0, n);
    const theta = i.mul(2 * Math.PI / goldenRatio);
    const phi = tf.acos( i.add(epsilon).mul(-2/(n-1+2*epsilon)).add(1) );
    const x = tf.cos(theta).mul(tf.sin(phi));
    const y = tf.sin(theta).mul(tf.sin(phi));
    const z = tf.cos(phi);
    const z_vecs = tf.stack([x, y, z], 1)

    const up_vecs = tf.stack([tf.zeros([n]), tf.ones([n]), tf.zeros([n])], 1);
    const y_vecs = normalize( cross(z_vecs, up_vecs) );
    const x_vecs = normalize( cross(y_vecs, z_vecs) );
    let Rz = tf.stack([x_vecs, y_vecs, z_vecs], 2)  // (num_sphere_pts, 3, 3)

    const rads = tf.range(0, num_xy_rots).mul(2*Math.PI/num_xy_rots);
    let Rxy = tf.stack([
        tf.stack([tf.cos(rads), tf.sin(rads), tf.zeros([num_xy_rots])], 1),
        tf.stack([tf.sin(rads).mul(-1), tf.cos(rads), tf.zeros([num_xy_rots])], 1),
        tf.stack([tf.zeros([num_xy_rots]), tf.zeros([num_xy_rots]), tf.ones([num_xy_rots])], 1),
    ], 1)

    let num_rots = num_sphere_pts * num_xy_rots;
    Rxy = Rxy.expandDims(1).tile([1, num_sphere_pts, 1, 1]).reshape([num_rots, 3, 3])
    Rz = Rz.expandDims(0).tile([num_xy_rots, 1, 1, 1]).reshape([num_rots, 3, 3])
    const rot_mats = Rz.matMul(Rxy);  // First rotate x-y coord (local), then Rz
    return rot_mats;
}
// grid_rotations_spiral(2, 2).print();

export {grid_rotations_spiral, random_rotations_avro};