// define dependent files
define(['jquery', 'three', 'utilities/Events', 'utilities/Broadcast', 'elements/Element3D'], 
    function($, threejs, EVENTS, BROADCAST, Element3D) {

    'use strict';

    var TYPES = {
            CUBE : 'cube',
            SPHERE : 'sphere'
        }, // types of 3D element
        elContent, // reference to main content
        elWindow, // reference window object
        width, // width to window
        height, // height to window
        scene, // threejs scene
        camera, // threejs camera
        projector, // threejs projector
        renderer, // threejs renderer
        elementType = TYPES.CUBE, // element type i.e. cube, sphere
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
        
        // start rendering
        render();
    }

    function onDocumentMouseDown (e) {

        var vector,
            dir,
            distance,
            position;

        // prevent default action
        e.preventDefault();

        // create 3D vector
        vector = new THREE.Vector3();

        // set vector values
        vector.set(
            (e.clientX / width) * 2 - 1,
            - (e.clientY / height) * 2 + 1,
            0.5);

        // get ray pointing in right direction
        vector.unproject(camera);

        dir = vector.sub(camera.position).normalize();

        distance = -camera.position.z / dir.z;

        position = camera.position.clone().add(dir.multiplyScalar(distance));

        // add a new element at the point of click
        addElement(position);
    }

    function addElement (position) {

        var element,
            desc = Element3D.descriptor();

        // set descriptor values
        desc.width = 50;
        desc.height = 50;
        desc.depth = 50;
        desc.colour = 0xffffff;
        desc.position = position;

        // create element depending on element type
        switch (elementType) {

            case TYPES.CUBE :

                element = Element3D.createCube(desc);

                break;

            case TYPES.SPHERE :

                break;
        }

        // store the cube in array for reference
        elements.push(element);

        // finally add the threejs cube to the scene
        scene.add(element.getEl());
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