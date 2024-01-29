import React from "react";
import Slide1PicA from "./images/Slide1PicA.png";
import Slide1PicB from "./images/Slide1PicB.png";
import Slide1PicC from "./images/Slide1PicC.png";
import Slide2PicA from "./images/Slide2PicA.png";
import Slide3PicA from "./images/Slide3PicA.png";
import Slide4PicA from "./images/Slide4PicA.png";
import Question1Graph from "./images/Question1Graph.png";
import Question2Graph from "./images/Question2Graph.png";
import Question3Graph from "./images/Question3Graph.png";
import Question2Info1 from "./images/Question2Info1.png";
import Question2Info2 from "./images/Question2Info2.png";
import Question4Graph from "./images/Question4Graph.png";
import Question5Pic1 from "./images/Question5Pic1.png";
import Question5Pic2 from "./images/Question5Pic2.png";
import Question5Pic3 from "./images/Question5Pic3.png";
import Question7Graph from "./images/Question7Graph.png";
import Question8Graph1 from "./images/Question8Graph1.png";
import Question8Graph2 from "./images/Question8Graph2.png";
import Question9Graph from "./images/Question9Graph.png";

import { TextByImage } from "../../../components/TutorialSlide/SlideHelpers";

export const tutorial = [
    {
        type: "info",
        content: [
            <h1>Fluorescence is the emission of light by chromophores</h1>,
            <h5><em>(molecules or chemical groups within molecules that contain conjugated ring systems, giving molecules their color)</em></h5>,
            <div className="imgs">
                <img src={Slide1PicA}/>
                <img src={Slide1PicB}/>
                <img src={Slide1PicC}/>
            </div>
        ]
    },
    {
        type: "info",
        content: [
            <h1>The <strong>simulation</strong> will use a fluorophore relevant to the experiment</h1>,
            <TextByImage img={Slide2PicA}>
                <h2>Fluorophores may be intrinsic or extrinsic</h2>
                <h2>A commonly studied intrinsic fluorophore in proteins is the amino acid tryptophan (Trp, W)</h2>
                <h2>Features of Trp's side chain:
                    <ul>
                        <li>Hydrophobic</li>        
                        <li>Contains a conjugated ring system</li>
                    </ul>
                </h2>
            </TextByImage>
        ]
    },
    {
        type: "info",
        content: [
            <h1>Fluorescence occurs when…</h1>,
            <TextByImage img={Slide3PicA} center>
                <h1>A sample containing a fluorophore absorbs light energy (&lambda;)</h1>
            </TextByImage>
        ]
    },
    {
        type: "info",
        content: [
            <TextByImage img={Slide4PicA} center>
                <h4>If some energy is lost and a quantized amount of energy remains, 
                    the quantum of energy that is emitted is called <strong>fluorescence</strong></h4>
            </TextByImage>
        ]
    },
    {
        type: "answer",
        question: [
            <h1>Every fluorophore has a unique excitation wavelength (i.e. absorption peak)</h1>,
            <img src={Question1Graph} />,
            <h2>What is the ideal excitation wavelength for Trp based on the data shown?</h2>
        ],
        answerType: "number",
        answer: [260, 300],
        units: "nm",
        explanation: "Explanation",
        hints: [
            "Your absorption peak value is not in the range of the actual result."
        ],
        randomHint: true,
    },
    {
        type: "mc",
        question: [
            <h1>Fluorescence will always occur at a longer wavelength than the excitation wavelength</h1>,
            <img src={Question2Graph} />,
            <h2>At what approximate wavelength does Trp emit fluorescence?</h2>
        ],
        options: [
            "280nm",
            "320nm",
            "352nm",
            "410nm",
        ],
        correct: 3,
        explanation: "You got it!",
        hints: [
            "Try again… This is the fluorescence excitation wavelength!",
            "Try again… Fluorescence emission is at a local minimum here!",
            "Correct Answer",
            "Try again… Fluorescence emission is relatively low here!"
        ],
        randomHint: false,
        inline: true
    },
    {
        type: "info",
        content: [
            <h1>Scanning over a range that includes the excitation usually drowns out the emission</h1>,
            <img src={Question2Info1} />,
            <img src={Question2Info2} />,
        ]
    },
    {
        type: "mc",
        question: [
            <h1>Bandwidth is the like the aperture of a camera setting.</h1>,
            <img src={Question3Graph} />,
            <h2>When you measure Trp fluorescence at different excitation and
            emission bandwidths, what trend do you observe?</h2>
        ],
        options: [
            "The larger the bandwidth, the more light passes through the shutter",
            "The smaller the bandwidth, the more light passes through the shutter",
            "Bandwidth doesn’t affect the amount of light that can pass through the shutter"
        ],
        correct: 1,
        explanation: "You got it!",
        hints: ["Think Again"],
        randomHint: true
    },
    {
        type: "mc",
        question: [
            <h1>Bandwidths for excitation and emission wavelengths can be changed independently</h1>,
            <img src={Question4Graph} />,
            <h2>What effect does increasing the excitation bandwidth have on Trp fluorescence? </h2>
        ],
        options: [
            "Increase intensity",
            "Decrease intensity",
            "No change"
        ],
        correct: 1,
        explanation: "You got it!",
        hints: ["Think Again"],
        randomHint: true,
        inline: true
    },
    {
        type: "mc",
        question: [
            <h1>What does the excitation bandwidth affect?</h1>,
            <div className="imgs">
                <img src={Question5Pic1} />
                <img src={Question5Pic2} />
                <img src={Question5Pic3} />
            </div>
        ],
        options: [
            "Amount of light exposed to the sample",
            "Amount of light exposed to the detector",
            "Amount of light exposed to both the sample and the detector"
        ],
        correct: 1,
        explanation: "You got it!",
        hints: [
            "Try again…Light exposed to the detector is not affected"
        ],
        randomHint: true
    },
    {
        type: "mc",
        question: [
            <h1>What does the emission bandwidth affect?</h1>,
            <div className="imgs">
                <img src={Question5Pic1} />
                <img src={Question5Pic2} />
                <img src={Question5Pic3} />
            </div>
        ],
        options: [
            "Amount of light exposed to the sample",
            "Amount of light exposed to the detector",
            "Amount of light exposed to both the sample and the detector"
        ],
        correct: 2,
        explanation: "You got it!",
        hints: ["Try again…Light exposed to the sample is not affected"],
        randomHint: true
    },
    {
        type: "mc",
        question: [
            <h1>How does response time affect Trp fluorescence?</h1>,
            <img src={Question7Graph} />,

        ],
        options: [
            "No change",
            "Faster response gives higher intensity",
            "Slower response gives higher intensity"
        ],
        correct: 2,
        explanation: "You got it!",
        hints: ["Think Again"],
        randomHint: true,
        inline: true
    },
    {
        type: "mc",
        question: [
            <h1>How does sensitivity affect Trp fluorescence?</h1>,
            <img src={Question8Graph2} />,
            <img src={Question8Graph1} />,
        ],
        options: [
            "The higher the sensitivity, the more intense the fluorescence measurements",
            "The lower the sensitivity, the more intense the fluorescence measurements",
            "Sensitivity has no impact on fluorescence intensity"
        ],
        correct: 1,
        explanation: "You got it!",
        hints: ["Think Again"],
        randomHint: true
    },
    {
        type: "mc",
        question: [
            <h1>How does Trp concentration affect fluorescence intensity?</h1>,
            <img src={Question9Graph} />,
        ],
        options: [
            "As [Trp] increases, fluorescence decreases",
            "As [Trp] increases, fluorescence increases",
            "[Trp] has no impact on fluorescence intensity"
        ],
        correct: 2,
        explanation: "You got it!",
        hints: ["Think Again"],
        randomHint: true
    },
];