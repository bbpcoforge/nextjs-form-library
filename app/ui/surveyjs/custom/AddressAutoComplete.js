import { createElement } from "react";
import { ElementFactory, Question, Serializer } from "survey-core";
import {
  SurveyQuestionElementBase,
  ReactQuestionFactory,
} from "survey-react-ui";
import AutoComplete from "./AutoComplete";

const CUSTOM_TYPE = "address-auto-complete";

// A model for the new question type
export class QuestionAddressAutoCompleteModel extends Question {
  getType() {
    return CUSTOM_TYPE;
  }
}

// Register `QuestionAddressAutoCompleteModel` as a model for the `yes-no-boolean` type
export function registerAddressAutoComplete() {
  ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name) => {
    return new QuestionAddressAutoCompleteModel(name);
  });
}

// Add question type metadata for further serialization into JSON
Serializer.addClass(
  CUSTOM_TYPE,
  [],
  function () {
    return new QuestionAddressAutoCompleteModel("");
  },
  "question"
);

// A class that renders questions of the new type in the UI
export class SurveyQuestionAddressAutoComplete extends SurveyQuestionElementBase {
  constructor(props) {
    super(props);
    this.state = { value: this.question.value };
  }
  get question() {
    return this.questionBase;
  }
  get value() {
    return this.question.value;
  }
  handleChange = (data) => {
    this.question.value = data.address;
  };
  // Support the read-only and design modes
  get style() {
    return this.question.getPropertyValue("readOnly") ||
      this.question.isDesignMode
      ? { pointerEvents: "none" }
      : undefined;
  }

  renderAddressAutoComplete() {
    return (
      <div className="container-address-auto-complete">
        <AutoComplete handleChange={this.handleChange} />
      </div>
    );
  }

  renderElement() {
    return <div style={this.style}>{this.renderAddressAutoComplete()}</div>;
  }
}

// Register `SurveyQuestionAddressAutoComplete` as a class that renders `yes-no-boolean` questions
ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props) => {
  return createElement(SurveyQuestionAddressAutoComplete, props);
});
