import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { StepProgressType } from '@this/types/StepProgress';

import logo from '../favicon.svg';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-entity': any
      'a-scene': any;
      'a-marker': any;
      'a-text': any;
      'a-camera': any;
      'a-camera-static': any;
      'a-assets': any;
      'a-asset-item': any
      'a-mixin': any
      'a-circle': any
      'a-plane': any
      'a-image': any
      'a-cursor': any
      'a-gui-flex-container': any
      'a-gui-cursor': any
      'a-gui-icon-label-button': any
      'a-gui-radio': any
      'a-gui-button': any

    }
  }
}


// Props used for StepData and Scene setup
interface MarkerEntityProps {
  userId: number
  step: StepProgressType
  setImage: (image: string | null | ArrayBuffer) => void;
  setInProgress: (inProgress: boolean) => void;
  // position?: [number, number, number];
  // text?: string;
  // rotation?: [number, number, number];
}
  // Geolocate Marker type scene taking in stepData name and coordinates
const MarkerEntity: React.FC<MarkerEntityProps> = ({ userId, step, setImage, setInProgress }) => {

  const canvas = useRef(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [journeyProgressId, setJourneyProgressId] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [stepName, setStepName] = useState<string | null> (null);
  const [tracks, setTracks] = useState<MediaStreamTrack | null> (null);



  const letsDraw = () => {
    try{
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: {
          facingMode: "environment",
        }, audio: false })
        .then((stream) => {
          const track = stream.getVideoTracks()[0];
          setTracks(track);
          return new (window as any).ImageCapture(track);
        })
        .then((imageCapture) => imageCapture.takePhoto())
        .then((blob) => console.log(blob))
        // .then((imageBitmap) => {
        //   console.log(imageBitmap)
        //   // const ctx = canvas.current.getContext('2d');
        //   // canvas.current.width = getComputedStyle(canvas.current).width.split("px")[0];
        //   // canvas.current.height = getComputedStyle(canvas.current).height.split("px")[0];
        //   // let ratio = Math.min(canvas.current.width / imageBitmap.width, canvas.current.height / imageBitmap.height);
        //   // let x = (canvas.current.width - imageBitmap.width * ratio) / 2;
        //   // let y = (canvas.current.height - imageBitmap.height * ratio) / 2;
        //   // ctx.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height, x, y, imageBitmap.width * ratio, imageBitmap.height * ratio );
        //   // const data = canvas.current.toDataURL("image/png");
        //   setImageSrc(imageBitmap)
        // })
    }}
    catch(error) {console.error('could not stream', error)}
  }


  useEffect(() => {
    setJourneyProgressId(step.journey_progress.id)
    setLatitude(step.step.latitude)
    setLongitude(step.step.longitude)
    setStepName(step.step.name)
  }, [])

  useEffect(() => {
    if(imageSrc !== null) {
          // use this once you have an image
      axios.post(`/cloud/stepProgress/${step.id}`, {data: imageSrc})
        .then((response) => {
          axios.put(`/step/progress/${step.id}`, {
            in_progress: false,
            image_url: response.data.secure_url
          })
          console.log(response.data.secure_url)
          setImage(response.data.secure_url)
          setInProgress(false);
        })
        .then(() => {
          tracks.stop();
          document.exitFullscreen();
        })
    }
  }, [imageSrc])

  const markerRef = useRef<any>(null);


  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setAttribute('animation', 'property: scale; to: 1.8 2 1.9; dir: alternate; loop: false')
    }
  }, []);

  return (
    <div>
      <div>I'm here</div>
    <canvas
      hidden
      width="400"
      height="300"
      ref={canvas}
    />
    <a-scene
      camera
      isMobile
      embedded
      >
      <a-camera>
        {/* <a-gui-cursor
                  id='cursor'
                  // raycaster="objects: [gui-interactable]"
                  fuse="true"
                  fuse-timeout="5000"
                  color="red"
                  hover-color="red"
                  active-color="red"
                  design="reticle"
                  >
        </a-gui-cursor> */}
        <a-cursor
          fuse="true"
          fuse-timeout="3000"
          color="red"
          geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
          material="color: red; shader: flat"
        />
      </a-camera>
{/*
      <a-gui-button
      width="4"
      height="1.5"
      position="0 2 -7"
      margin="0.1"
      font-color="#000000"
      font-size="30px"
      background-color="#000000"
      onClick={letsDraw}
      ></a-gui-button> */}
      <a-entity
        ref={markerRef}
        gps-entity-place={
          `latitude: ${latitude};
          longitude: ${longitude};`}
        id="marker"
        position={`0 2 -5`}
        animation="property: scale; to: 1.8 2 1.9; dir: alternate; loop: false"
        geometry="primitive: plane; width: 2; height: 0.7"
        material="color: '#2F0A00'; shader: flat; transparent: true; opacity: 0.7"
        text={`value: ${stepName}; width: 3; align: center; zOffset: 0.1; color: #000000`}
        onClick={letsDraw}

      />

      <a-image
        src={logo}
        width="0.3"
        height="0.3"
        position="0 1.6 -4"
      />

      <a-plane
        width="4.5"
        height="1.9"
        color="#835500"
        position="0 2.1 -6" >
      </a-plane>

   </a-scene>
   </div>
  );
};

export default MarkerEntity;
