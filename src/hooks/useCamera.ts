import { useState, useRef } from 'react';
import { CameraView } from 'expo-camera';

export const useCamera = () => {
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7, base64: false });
      if (photo) {
        setPhotoUri(photo.uri);
        return photo.uri;
      }
    }
    return null;
  };

  return { cameraRef, photoUri, takePicture, setPhotoUri };
};