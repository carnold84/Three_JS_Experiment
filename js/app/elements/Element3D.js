// define dependent files
define(['jquery', 'three', 'elements/Class'], 
    function($, threejs, Class) {

    'use strict';

    var Element3D, // base class
        Cube; // cube threejs element

    function Descriptor () {

        this.position = undefined;
        this.width = undefined;
        this.height = undefined;
        this.depth = undefined;
        this.colour = undefined;
    }

    // create the base class
    function Element3D (desc) {}

    Element3D.prototype.getEl = function ()  {
        return this.el;
    };

    Element3D.prototype.setRotationInDegrees = function (x, y, z) {
            
        this.el.rotation.x = Math.PI * x / 180;
        this.el.rotation.y = Math.PI * y / 180;
        this.el.rotation.z = Math.PI * z / 180;
    };

    // create Cube class and inherit from Element3D
    function Cube (desc) {

        console.log('Cube created');
            
        // create the geometry and material for the mesh
        this.geometry = new THREE.BoxGeometry(desc.width, desc.height, desc.depth);
        this.material = new THREE.MeshPhongMaterial({color: 0xffffff});

        // create the cube
        this.el = new THREE.Mesh(this.geometry, this.material);

        // store position
        this.position = desc.position;

        // set position
        this.el.position.set(this.position.x, this.position.y, this.position.z);
    }

    // Cube inherits from Element3D
    Cube.prototype = new Element3D;

    // create Sphere class and inherit from Element3D
    function Sphere (position, radius, widthSegments, heightSegments) {

        console.log('Sphere created');
            
        // create the geometry and material for the mesh
        this.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        this.material = new THREE.MeshPhongMaterial({color: 0xffff00});

        // create the cube
        this.el = new THREE.Mesh(this.geometry, this.material);

        // store position
        this.position = position;

        // set position
        this.el.position.set(this.position.x, this.position.y, this.position.z);
    }

    // Cube inherits from Element3D
    Sphere.prototype = new Element3D;

    return {
        
        descriptor : function () {
            return new Descriptor();
        },
        createCube : function (desc) {
            return new Cube(desc);
        },
        createSphere : function (radius, widthSegments, heightSegments) {
            return new Sphere(radius, widthSegments, heightSegments);
        }
    };

});