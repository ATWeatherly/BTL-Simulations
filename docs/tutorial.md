# Tutorial Templates

## Slide Types:


### Info :
> Information slide with static/non-interactable content. Useful for presenting information.

### MultipleChoice :
> Slide for multiple-choice questions. 

### ShortAnswer :
> Slide for short-answer-based questions. Can be used for numerical or word/phrase answers.


# Info

## Parameters:

### type : `info`

### content : *JSX array*
> Content of the slide.



# Multiple Choice

## Parameters:

### type : `mc`

### question : *JSX array*
> Content of the question.

### options : *String array*
> Options for possible answers.

### correct : *int*
> Integer index of the correct answer in the options array.

### explanation : *String*
> Explanation for the correct answer.

### hints : *String array **or** object of String arrays*

> Hint(s) shown when an incorrect answer is selected. If a String array, a hint is chosen randomly from the array, regardless of the selected option. Otherwise, hints are chosen from the String array corresponding to the option's index in the object.

### randomHint : *bool*
> Boolean value for whether a hint is given for wrong answer randomly or based on which answer is picked

# Short Answer

## Parameters:

### type : `answer`

### question : *JSX Array*
> Content of the question.

### answerType: *String*
> Either `number` or `text`, corresponding to the type of othe answer: numerical or text, respectively.

### answer: *String array **or** int[2] array*
> If the `answerType` is `text`, this is the list of acceptable answers. If the `answerType` is `number`, the first int represents the lower bound and the second int represents the upper bound on acceptable answers.

### caseSensitive : *boolean, optional*
> Denotes whether the answer is case-sensitive. Does nothing for `answerType: number`. Defaults to `false`.

### units : *String, optional* 
> The units displayed next to the input field. Does nothing for `answerType: text`.

### explanation : *String*
> Explanation for the correct answer.

### hints : *String array*
> Hint(s) shown when an incorrect answer is submitted. A hint is randomly chosen to be shown from the array.