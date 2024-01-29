import React from "react";
import { Link } from "gatsby";

import Modal from "../Modal/Modal";
import "./styles.scss";

export default function TutorialSlide(props) {
    const data = props.data;
    let slide;

    switch(data.type) {
        case "info":
            slide = <InfoSlide data={data} />;
            break;
        case "mc":
            slide = <MCSlide data={data} correctUpdate_Callback={props.update_correct} />;
            break;
        case "answer":
            slide = <AnswerSlide data={data} correctUpdate_Callback={props.update_correct} />;
            break;
        case "complete":
            slide = <CompletionSlide data={data} correct={props.correct} />;
            break;
        default:
            slide = <h1>Invalid slide type</h1>;
            break;
    }

    return (
        <div id={props.id} className={"tutorial-slide" + (props.active ? " active" : "")}>
            {slide}
        </div>
    );
}

class InfoSlide extends React.Component {
    render() {
        return (
            <div className="info-slide pad-sides">
                {this.props.data.content}
            </div>
        );
    }
}

class MCSlide extends React.Component {
    data = this.props.data;
    showModal = null;
    check = true;

    selectOption = (id) => {
        if (id + 1 === this.data.correct) {
            this.showModal([<strong>Correct! </strong>, this.data.explanation ?? ""])
            if (this.check) {
                this.props.correctUpdate_Callback();
            }
        } else {
            if(this.data.randomHint) {
                this.showModal("Incorrect. " + randomHint(this.data.hints));
            } else {
                this.showModal("Incorrect. " + this.data.hints[id]);
            }
        }
        this.check = false;
    }

    render() {
        const options = [];
        for (let i = 0; i < this.data.options.length; i++) {
            options.push(<button key={i} className="mc-option" onClick={() => this.selectOption(i)}>{this.data.options[i]}</button>);
        }
        return (
            <InputSlide 
                className={"mc-slide" + (this.data.inline ? " inline" : "")}
                question={this.data.question} 
                modalFunc={(f) => this.showModal = f}
            >
                {options}
            </InputSlide>
        );
    }
}

class AnswerSlide extends React.Component {
    constructor(props) {
        super(props);
    }
    
    data = this.props.data;
    showModal = null;
    check = true;

    submitAnswer = (e) => {
        e.preventDefault();
        let submission = e.target[0].value.trim().toLowerCase();

        if (submission === "") {
            return;
        }

        let correct = false;

        if (this.data.answerType === "number") {
            submission = parseFloat(submission);
            correct = submission >= this.data.answer[0] && submission <= this.data.answer[1];
        } else {
            if (typeof this.data.answer === "string") {
                correct = submission === this.data.answer.toLowerCase();
            } else {
                for (let answer of this.data.answer) {
                    if (submission === answer.toLowerCase()) {
                        correct = true;
                        break;
                    }
                }
            }
        }

        if (correct) {
            this.showModal([<strong>Correct! </strong>, this.data.explanation ?? ""])
            if (this.check) {
                this.props.correctUpdate_Callback();
            }
        } else {
            this.showModal("Incorrect. " + randomHint(this.data.hints));
        }

        this.check = false;
    }

    render() {
        return (
            <InputSlide 
                className="answer-slide"
                question={this.data.question} 
                modalFunc={(f) => this.showModal = f}
            >
            <form onSubmit={this.submitAnswer}>
                <input className="answer-input" type="text" />
                <span className="answer-units math">{this.data.units ?? ""}</span>
                <button className="answer-submit" type="submit">Submit</button>
            </form>
            </InputSlide>
        );
    }
}

class InputSlide extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            msg: "",
        }
    }

    setRef = (ref) => {
        this.props.modalFunc(ref.showModal);
    }

    render() {
        return (
            <div className={"input-slide pad-sides " + this.props.className}>
                <Modal refFunc={this.setRef}>{this.props.msg}</Modal>
                <div className="input-question">
                    {this.props.question}
                </div>
                <div className="input-options">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class CompletionSlide extends React.Component {
    curr_data = this.props.data;
    render() {
        
        return (
            <div className="completion-slide pad-sides">
                <h1>Congratulations!</h1>
                <h2>You have completed the {this.props.data.name}.</h2>
                <h2>Your score was {this.props.correct} out of {this.props.data.questionCount}</h2>
                <div className="cs-btns">
                    <Link to="/">Home</Link>
                    <a onClick={() => window.location.reload()}>Start Over</a>
                </div>
            </div>
        );
    }
}

function randomHint(hints) {
    if (hints === undefined) {
        return "";
    }
    return hints[Math.floor(Math.random() * hints.length)];
}