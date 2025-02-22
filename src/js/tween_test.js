import TWEEN from '@tweenjs/tween.js';

class MyTween {
  constructor(viewer, stateRecordArr) {
    this.targetTweenEasing = {
      id: TWEEN.Easing.Linear.None,
      name: 'Linear'
    };
    this.posTweenEasing = {
      id: TWEEN.Easing.Linear.None,
      name: 'Linear'
    };
    this.upTweenEasing = {
      id: TWEEN.Easing.Linear.None,
      name: 'Linear'
    };

    this.targetTweenDuration = 2500;
    this.posTweenDuration = 2500;
    this.upTweenDuration = 2500;
    this.viewer = viewer;
    this.animate = true;
    this.stateRecordArr = stateRecordArr || [];
  }

  tweenCameraTo = ({ viewport: { target, eye, up } } = state, immediate) => {
    if (target && eye && up) {
      let targetEnd = new THREE.Vector3(target[0], target[1], target[2]);
      let posEnd = new THREE.Vector3(eye[0], eye[1], eye[2]);
      let upEnd = new THREE.Vector3(up[0], up[1], up[2]);

      let nav = this.viewer.navigation;
      let copyTarget = new THREE.Vector3().copy(nav.getTarget());
      let copyPos = new THREE.Vector3().copy(nav.getPosition());
      let copyUp = new THREE.Vector3().copy(nav.getCameraUpVector());

      let targetTween = this.createTween({
        easing: this.targetTweenEasing.id,
        onUpdate: (v) => {
          nav.setTarget(v)
        },
        duration: immediate ? 0 : this.targetTweenDuration,
        object: copyTarget,
        to: targetEnd
      });
      let posTween = this.createTween({
        easing: this.posTweenEasing.id,
        onUpdate: (v) => {
          nav.setPosition(v)
        },
        duration: immediate ? 0 : this.posTweenDuration,
        object: copyPos,
        to: posEnd
      });
      let upTween = this.createTween({
        easing: this.upTweenEasing.id,
        onUpdate: (v) => {
          nav.setCameraUpVector(v)
        },
        duration: immediate ? 0 : this.upTweenDuration,
        object: copyUp,
        to: upEnd
      });

      Promise.all([targetTween, posTween, upTween]).then(() => this.animate = false);

      this.runAnimation(true);
    }
  }

  runAnimation = (start) => {
    if (start || this.animate) {
      if (!this.animate) {
        window.cancelAnimationFrame(this.runAnimation);
        return;
      }
      window.requestAnimationFrame(this.runAnimation);
      console.log("TWEEN.update")
      TWEEN.update();
    }
  }

  createTween = (params) => {
    return new Promise((resolve) => {
      new TWEEN.Tween(params.object)
        .to(params.to, params.duration)
        .onComplete(() => resolve())
        .onUpdate(params.onUpdate)
        .easing(params.easing)
        .start()
    })
  }

  palyStateRecord() {
    this && this.stateRecordArr.length && this.stateRecordArr.reverse().forEach(state => this.tweenCameraTo(state, false));
  }
}

export default MyTween;