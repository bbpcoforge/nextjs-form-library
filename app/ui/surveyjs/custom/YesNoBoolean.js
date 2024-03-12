import { createElement } from "react";
import { ElementFactory, Question, Serializer } from "survey-core";
import {
  SurveyQuestionElementBase,
  ReactQuestionFactory,
} from "survey-react-ui";
import "./YesNoBoolean.css";

const CUSTOM_TYPE = "yes-no-boolean";

// A model for the new question type
export class QuestionYesNoBooleanModel extends Question {
  getType() {
    return CUSTOM_TYPE;
  }
  get trueText() {
    return this.getPropertyValue("trueText");
  }
  set trueText(val) {
    this.setPropertyValue("trueText", val);
  }
  get falseText() {
    return this.getPropertyValue("falseText");
  }
  set falseText(val) {
    this.setPropertyValue("falseText", val);
  }
}

// Register `QuestionYesNoBooleanModel` as a model for the `yes-no-boolean` type
export function registerYesNoBoolean() {
  ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name) => {
    return new QuestionYesNoBooleanModel(name);
  });
}

// Add question type metadata for further serialization into JSON
Serializer.addClass(
  CUSTOM_TYPE,
  [
    {
      name: "trueText",
      default: "Yes",
      category: "general",
      visibleIndex: 3, // After the Name, Title and Description
    },
    {
      name: "falseText",
      default: "No",
      category: "general",
      visibleIndex: 4,
    },
  ],
  function () {
    return new QuestionYesNoBooleanModel("");
  },
  "question"
);

// A class that renders questions of the new type in the UI
export class SurveyQuestionYesNoBoolean extends SurveyQuestionElementBase {
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
    this.question.value = data;
  };
  get trueLable() {
    return this.question.trueText;
  }
  get falseLable() {
    return this.question.falseText;
  }
  // Support the read-only and design modes
  get style() {
    return this.question.getPropertyValue("readOnly") ||
      this.question.isDesignMode
      ? { pointerEvents: "none" }
      : undefined;
  }

  renderYesNoBoolean() {
    return (
      <div className="container-custom-boolean-button">
        <button
          className={`custom-boolean-button ${this.value ? "active" : ""}`}
          onClick={() => this.handleChange(true)}
        >
          {this.trueLable}
        </button>
        <button
          className={`custom-boolean-button ${
            this.value !== undefined && !this.value ? "active" : ""
          }`}
          onClick={() => this.handleChange(false)}
        >
          {this.falseLable}
        </button>
      </div>
    );
  }

  renderElement() {
    return <div style={this.style}>{this.renderYesNoBoolean()}</div>;
  }
}

// Register `SurveyQuestionYesNoBoolean` as a class that renders `yes-no-boolean` questions
ReactQuestionFactory.Instance.registerQuestion(CUSTOM_TYPE, (props) => {
  return createElement(SurveyQuestionYesNoBoolean, props);
});
