import { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useCameraPermissions, PermissionStatus } from "expo-camera";
import { loadTensorflowModel } from "react-native-fast-tflite";

// Ensure model is included in the project assets
const modelSource = require("assets/model_unquant.tflite");

export default function Index() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [cameraPermission, requestPermission] = useCameraPermissions();
  const [model, setModel] = useState<any>(null); // Store loaded model

  // Load TensorFlow Lite Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await loadTensorflowModel(modelSource);
        setModel(loadedModel);
        console.log("Model loaded successfully");
      } catch (error) {
        console.error("Error loading model:", error);
        Alert.alert("Model Error", "Failed to load the model.");
      }
    };
    loadModel();
  }, []);

  // Pick an Image from Files
  const pickImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });
      if (result.assets) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  // Capture an Image using Camera
  const takePhoto = async () => {
    if (
      !cameraPermission ||
      cameraPermission.status !== PermissionStatus.GRANTED
    ) {
      const permissionResponse = await requestPermission();
      if (!permissionResponse.granted) {
        Alert.alert(
          "Permission Denied",
          "Enable camera permissions in settings."
        );
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to Process Image with the Model (Placeholder)
  const classifyImage = async () => {
    if (!model) {
      Alert.alert("Error", "Model is not loaded yet.");
      return;
    }

    if (!imageUri) {
      Alert.alert("Error", "No image selected.");
      return;
    }

    try {
      // Convert imageUri to a tensor (TODO: Implement actual preprocessing)
      const result = await model.predict(imageUri); // Placeholder function
      console.log("Prediction Result:", result);
      Alert.alert("Prediction", JSON.stringify(result));
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Prediction Error", "Failed to process image.");
    }
  };

  return (
    <View className="bg-slate-300 h-full w-full justify-center items-center p-5">
      <Text className="text-black text-2xl mb-4">Image Classifier</Text>

      {imageUri && (
        <Image source={{ uri: imageUri }} className="w-64 h-64 rounded-lg" />
      )}

      <View className="flex-row mt-4">
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg mr-2"
          onPress={pickImage}
        >
          <Text className="text-white">Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 px-4 py-2 rounded-lg"
          onPress={takePhoto}
        >
          <Text className="text-white">Take Photo</Text>
        </TouchableOpacity>
      </View>

      {imageUri && model && (
        <TouchableOpacity
          className="bg-purple-500 px-4 py-2 rounded-lg mt-4"
          onPress={classifyImage}
        >
          <Text className="text-white">Classify Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
