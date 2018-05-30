import * as THREE from "three";

import { logistic } from "../../../math";
import { Component } from "../component";
import { simulateVeinBoneGravity } from "../physics";
import { LeafTemplate } from "../veinMesh/leafTemplate";
import { VeinedLeafSkeleton } from "../veinMesh/veinedLeafSkeleton";

export class Leaf extends Component {
    static petioleMaterial = new THREE.MeshLambertMaterial({
        color: "green",
        side: THREE.DoubleSide,
    });

    static petioleGeometry = (() => {
        const geom = new THREE.CylinderBufferGeometry(0.01, 0.006, 1);
        geom.rotateZ(Math.PI / 2);
        geom.translate(0.5, 0, 0);
        return geom;
    })();

    public lamina: THREE.SkinnedMesh;
    constructor(template: LeafTemplate) {
        super();
        const petioleLength = THREE.Math.randFloat(0.4, 0.5);
        if (petioleLength > 0) {
            const petiole = (() => {
                const petioleMesh = new THREE.Mesh(
                    Leaf.petioleGeometry,
                    Leaf.petioleMaterial,
                );
                petioleMesh.castShadow = true;
                petioleMesh.receiveShadow = true;
                petioleMesh.matrixAutoUpdate = false;
                petioleMesh.scale.setScalar(petioleLength);
                petioleMesh.updateMatrix();
                return petioleMesh;
            })();
            this.add(petiole);
        }
        this.lamina = template.instantiateLeaf();
        this.lamina.position.x = petioleLength * 0.98;
        this.lamina.position.y = 0.0015;
        this.add(this.lamina);
    }

    updateSelf(t: number) {
        const msAlive = t - this.timeBorn;
        const logisticX = msAlive / 1000 - 6;
        const s = logistic(logisticX);
        this.scale.set(s, s, s);

        const [...bones] = this.lamina.skeleton.bones;
        const stiffness = THREE.Math.mapLinear(Math.sin(msAlive / 1000), -1, 1, 0, 0.01);
        for (const bone of bones) {
            simulateVeinBoneGravity(bone, stiffness);
        }

        // for (const boneUncast of this.lamina.skeleton.bones) {
        //     // HACKHACK make this based off physics instead
        //     const bone = boneUncast as VeinBone;
        //     const skeleton = this.lamina.skeleton as VeinedLeafSkeleton;
        //     // curl the leaves
        //     let { x, y: z } = bone.vein.position;
        //     x *= skeleton.downScalar;
        //     z *= skeleton.downScalar;
        //     const len = Math.sqrt(x * x + z * z);
        //     bone.rotation.z = (0.003 * Math.sin(t / 2000) - Math.abs(z) * 0.5 + Math.abs(x) * 0.01) * len;

        //     // TODO make the position integrate to a log(1+x) look properly
        //     const t2 = Math.abs(z) * 40 - 6;
        //     const pos = logistic(t2) * ( 1 - logistic(t2)) * 0.01;
        //     bone.position.y = -pos;
        //     // bone.rotation.y = 0.1 / (1 + Math.abs(z) * 10);
        // }
    }

    static generate(template: LeafTemplate) {
        return new Leaf(template);
    }
}
