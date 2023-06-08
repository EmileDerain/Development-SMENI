import React from "react";
import * as tf from "@tensorflow/tfjs";
import {bundleResourceIO} from "@tensorflow/tfjs-react-native";


export const HeartBeat = async (file) => {
    console.log("[+] loading heartbeat model");
//loading the json then the bin model
    const modelJson = await require("../../assets/ai/model.json");
    const modelWeight = await require("../../assets/ai/model.bin");

    const heartDetector = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight));


    return await heartDetector.predict("./murmur.wav").data();

}