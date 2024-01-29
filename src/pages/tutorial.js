import React from "react";
import PrimaryTemplate from "../components/templates/PrimaryTemplate/PrimaryTemplate";
import { getLabData, getLabIdFromUrl, getLabTutorial } from "../utils/LabLoader";
import "../styles/tutorial.scss";
import TutorialSlide from "../components/TutorialSlide/TutorialSlide";

import ArrowLeft from "../images/arrow-left.svg";
import ArrowRight from "../images/arrow-right.svg";

export default class TutorialPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            curr: 0,
            correct: 0
        }
    }
    
    id = getLabIdFromUrl(this.props.location);
    data = getLabData(this.id);

    tutorial = this.data?.tutorial ? getLabTutorial(this.id) : null;
    numSlides = this.tutorial?.length + 1;
    
    changeSlide = (dir) => {
        let newSlide = this.state.curr + dir;
        if (newSlide < 0) {
            newSlide = 0;
        } else if (newSlide >= this.numSlides) {
            newSlide = this.numSlides - 1; 
        }

        if (newSlide !== this.state.curr) {
            const currSlide = document.getElementById("slide" + this.state.curr);
            const nextSlide = document.getElementById("slide" + newSlide);

            currSlide.classList.add("fade-out");
            setTimeout(() => {
                currSlide.classList.remove("active", "fade-out");
            }, 500);

            setTimeout(() => {
                nextSlide.classList.add("active");
            }, 500);
        }
        
        this.setState({
            curr: newSlide
        });
    }

    updateCorrect = () => {
        this.setState({ correct: this.state.correct + 1 });
    }

    render() {
        let body;
        if (this.id !== null && this.data.tutorial) {
            const slideElements = [];
            let question_count = 0
            for (let i = 0; i < this.tutorial.length; i++) {
                if (this.tutorial[i].type === "complete") {
                    continue;
                } else if (this.tutorial[i].type === "mc" || this.tutorial[i].type === "answer") {
                    question_count++;
                }
                slideElements.push(<TutorialSlide 
                    data={this.tutorial[i]} 
                    id={"slide" + i} key={i} 
                    active={i === 0} 
                    update_correct={this.updateCorrect}
                />);
            }
            slideElements.push(<TutorialSlide 
                data={{ type: "complete", name: this.data.name, questionCount: question_count }}
                id={"slide" + slideElements.length} 
                key={slideElements.length}
                correct={this.state.correct}
                />);
                
            body = (
                <PrimaryTemplate id="tutorial" className="no-pad" noFooter side nobg>
                    <div id="tutorial-header">
                        <h1>{this.data.name}</h1>
                    </div>
                    <div id="tutorial-progress">
                        <div id="bar" style={{width: (100 * (this.state.curr + 1) / this.numSlides) + "%"}}/>
                        <button onClick={() => this.changeSlide(-1)} disabled={this.state.curr === 0}>
                            <img src={ArrowLeft} alt="Previous Slide"/>
                        </button>
                        <span id="number">{this.state.curr + 1} of {this.numSlides}</span>
                        <button onClick={() => this.changeSlide(1)} ><img src={ArrowRight} alt="Next Slide"/></button>
                    </div>
                    <div id="tutorial-container">
                        {slideElements}
                    </div>
                </PrimaryTemplate>
            );
        } else {
            body = (
                <PrimaryTemplate side>
                    <h1>Invalid lab</h1>
                </PrimaryTemplate>
            );
        }

        return body;
    }
}
