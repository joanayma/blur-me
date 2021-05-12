const { GObject, GLib, Clutter } = imports.gi;
const AdvancedBlurActor = GObject.registerClass(
  {
    GTypeName: "AdvancedBlurActor",
  },
  class AdvancedBlurActor extends Clutter.Actor {
    _init(params = {}) {
      // Depending on the parent class, GObjects may take a dictionary of
      // construct properties.
      super._init(params);

      /**
       * @type {Clutter.Actor[]}
       */
      this.tileActors = [];
      this.srcTile = new Clutter.Actor();
      let blayout = new Clutter.BoxLayout();
      this.set_layout_manager(blayout);
      blayout.child_set_property(this, this.srcTile, "x-fill", true);
      blayout.child_set_property(this, this.srcTile, "y-fill", true);
      blayout.child_set_property(this, this.srcTile, "expand", true);
      let constraintSizeX = new Clutter.BindConstraint({
        source: this,
        coordinate: Clutter.BindCoordinate.WIDTH,
        offset: 0,
      });
      // let constraintSizeY = new Clutter.BindConstraint({
      //   source: this,
      //   coordinate: Clutter.BindCoordinate.HEIGHT,
      //   offset: 0,
      // });

      this.srcTile.add_constraint(constraintSizeX);
      // this.srcTile.add_constraint(constraintSizeY);
      this.srcTile.set_position(0, 0);
      this.add_child(this.srcTile);
    }
    initBlurParts(radius) {
      this.tileActors.forEach((x) => this.remove_child(x));
      this.tileActors = [];
      let blurActor = this;
      for (let ik = 0; ik < radius; ik++) {
        let oo =
          radius - Math.sqrt(radius * radius - (radius - ik) * (radius - ik));
        blurActor.addNineTileActor(
          [oo, Clutter.SnapEdge.TOP],
          [ik, Clutter.SnapEdge.LEFT],
          [radius, Clutter.SnapEdge.TOP],
          [ik + 1, Clutter.SnapEdge.LEFT],
          new Clutter.Actor()
        );
        blurActor.addNineTileActor(
          [-radius, Clutter.SnapEdge.BOTTOM],
          [ik, Clutter.SnapEdge.LEFT],
          [-oo, Clutter.SnapEdge.BOTTOM],
          [ik + 1, Clutter.SnapEdge.LEFT],
          new Clutter.Actor()
        );
      }
      blurActor.addNineTileActor(
        [radius, Clutter.SnapEdge.TOP],
        [0, Clutter.SnapEdge.LEFT],
        [-radius, Clutter.SnapEdge.BOTTOM],
        [radius, Clutter.SnapEdge.LEFT],
        new Clutter.Actor()
      );
      blurActor.addNineTileActor(
        [0, Clutter.SnapEdge.TOP],
        [radius, Clutter.SnapEdge.LEFT],
        [0, Clutter.SnapEdge.BOTTOM],
        [-radius, Clutter.SnapEdge.RIGHT],
        new Clutter.Actor()
      );
      blurActor.addNineTileActor(
        [radius, Clutter.SnapEdge.TOP],
        [-radius, Clutter.SnapEdge.RIGHT],
        [-radius, Clutter.SnapEdge.BOTTOM],
        [0, Clutter.SnapEdge.RIGHT],
        new Clutter.Actor()
      );
      for (let ik = 0; ik < radius; ik++) {
        let oo =
          radius - Math.sqrt(radius * radius - (radius - ik) * (radius - ik));
        blurActor.addNineTileActor(
          [oo, Clutter.SnapEdge.TOP],
          [-ik - 1, Clutter.SnapEdge.RIGHT],
          [radius, Clutter.SnapEdge.TOP],
          [-ik, Clutter.SnapEdge.RIGHT],
          new Clutter.Actor()
        );
        blurActor.addNineTileActor(
          [-radius, Clutter.SnapEdge.BOTTOM],
          [-ik - 1, Clutter.SnapEdge.RIGHT],
          [-oo, Clutter.SnapEdge.BOTTOM],
          [-ik, Clutter.SnapEdge.RIGHT],
          new Clutter.Actor()
        );
      }
    }
    /**
     *
     * @param {[number,Clutter.SnapEdge]} top
     * @param {[number,Clutter.SnapEdge]} left
     * @param {[number,Clutter.SnapEdge]} bottom
     * @param {[number,Clutter.SnapEdge]} right
     * @param {Clutter.Actor} actor
     */
    addNineTileActor(top, left, bottom, right, actor) {
      let src = this.srcTile;
      let constraintTop = new Clutter.SnapConstraint({
        source: src,
        toEdge: top[1],
        fromEdge: Clutter.SnapEdge.TOP,
        offset: top[0],
      });
      let constraintLeft = new Clutter.SnapConstraint({
        source: src,
        toEdge: left[1],
        fromEdge: Clutter.SnapEdge.LEFT,
        offset: left[0],
      });
      let constraintBottom = new Clutter.SnapConstraint({
        source: src,
        toEdge: bottom[1],
        fromEdge: Clutter.SnapEdge.BOTTOM,
        offset: bottom[0],
      });
      let constraintRight = new Clutter.SnapConstraint({
        source: src,
        toEdge: right[1],
        fromEdge: Clutter.SnapEdge.RIGHT,
        offset: right[0],
      });

      actor.add_constraint(constraintTop);
      actor.add_constraint(constraintLeft);
      actor.add_constraint(constraintBottom);
      actor.add_constraint(constraintRight);
      this.tileActors.push(actor);
      this.add_child(actor);
      // actor.set_size(100,100);
      // actor.set_background_color(Clutter.Color.from_hls(0,0.5,1));
    }
  }
);
