// define dependent files
define(['jquery', 'three', 'utilities/Events', 'utilities/Broadcast', 'elements/Element3D'], 
    function($, threejs, EVENTS, BROADCAST, Element3D) {

    'use strict';

    var TYPES = {
            CUBE : 'cube',
            SPHERE : 'sphere'
        }, // types of 3D element
        CONVERSIONS = {
            DEGREES_IN_RADIAN : 57.3,
            DEGREES_IN_CIRCLE : 360,
            RADIANS_IN_CIRCLE : 360 / 57.3
        },

        elContent, // reference to main content
        elWindow, // reference window object
        width, // width to window
        height, // height to window
        scene, // threejs scene
        camera, // threejs camera
        light, // threejs light
        projector, // threejs projector
        renderer, // threejs renderer
        elementType = TYPES.SPHERE, // element type i.e. cube, sphere
        elements = []; // array to store threejs cubes

    function init () {

        // cache DOM references for speed
        elContent = $('#content');
        elWindow = $(window);

        // cache the content size
        width = elContent.width();
        height = elContent.height();

        // create the renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);

        // add the renderers canvas element to main content div
        elContent.append(renderer.domElement);
        
        // create the scene
        scene = new THREE.Scene;

        // listen for clicks in content area
        $(elContent).on('mousedown', onDocumentMouseDown);

        // add a camera
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);

        // set camera position
        camera.position.y = 0;
        camera.position.z = 400;

        // add the camera
        scene.add(camera);

        light = new THREE.AmbientLight(0xffffff);

        // add the light
        scene.add(light);
        
        // start rendering
        render();
    }

    function onDocumentMouseDown (e) {

        // prevent default action
        e.preventDefault();

        // add a new element at the point of click
        createElements(e.clientX, e.clientY, 100);
    }

    function getPosition (x, y) {

        var vector,
            dir,
            distance;

        // create 3D vector
        vector = new THREE.Vector3();

        // set vector values
        vector.set(
            (x / width) * 2 - 1,
            - (y / height) * 2 + 1,
            0.5);

        // get ray pointing in right direction
        vector.unproject(camera);

        dir = vector.sub(camera.position).normalize();

        distance = -camera.position.z / dir.z;

        return camera.position.clone().add(dir.multiplyScalar(distance));
    }

    function createElements (centre_x, centre_y, radius) {

        var i = 0,
            num_elements = 8,
            x,
            y,
            element,
            group = new THREE.Object3D(),
            angle,
            position;

        for (i; i < num_elements; i++) {

            angle = ((CONVERSIONS.DEGREES_IN_CIRCLE / num_elements) / CONVERSIONS.DEGREES_IN_RADIAN) * i;

            x = radius * Math.cos(angle) + centre_x;
            y = radius * Math.sin(angle) + centre_y;

            position = getPosition(x, y);

            element = createElement(position);

            // add a new element at the point of click
            group.add(element.getEl());
        }

        group.position.set(0, 0, (Math.random() * 100));

        group.rotation.x = Math.random() * CONVERSIONS.RADIANS_IN_CIRCLE;

        // store the group in array for reference
        elements.push(group);

        // finally add the threejs group to the scene
        scene.add(group);
    }

    function createElement (position) {

        var element,
            desc = Element3D.descriptor();

        // set descriptor values
        desc.width = 10;
        desc.height = 10;
        desc.depth = 50;
        desc.colour = 0xffffff;
        desc.position = position;

        // create element depending on element type
        switch (elementType) {

            case TYPES.CUBE :

                element = Element3D.createCube(desc);

                break;

            case TYPES.SPHERE :

                element = Element3D.createSphere(position, 10, 24, 24)

                break;
        }

        return element;
    }

    function render() {

        // start animation/render loop
        requestAnimationFrame(render);

        // render the scene
        renderer.render(scene, camera);
    }

    return {
        
        init : init
    };

});