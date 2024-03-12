"use client";
import { useEffect, useCallback } from "react";
import { Model, ComponentCollection, Serializer } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.css";
import "./index.css";
import Loader from "./Loader";
import { registerYesNoBoolean } from "./custom/YesNoBoolean";
//import { registerAddressAutoComplete } from "./custom/AddressAutoComplete";

//Register new "YesNoBoolean" component
registerYesNoBoolean();
//Register new "AddressAutoComplete" component
//registerAddressAutoComplete();
//Register new "country" component
ComponentCollection.Instance.add({
  //Unique component name. It becomes a new question type. Please note, it should be written in lowercase.
  name: "country",
  //The text that shows on toolbox
  title: "Country",
  //The actual question that will do the job
  questionJSON: {
    type: "dropdown",
    placeholder: "Select a country...",
    choicesByUrl: {
      url: "https://surveyjs.io/api/CountriesExample",
    },
  },
});
//Register new "full name" component
ComponentCollection.Instance.add({
  name: "fullname",
  title: "Full Name",
  elementsJSON: [
    { type: "text", name: "firstName", title: "First Name", isRequired: true },
    // Optional question, hidden by default
    {
      type: "text",
      name: "middleName",
      title: "Middle Name",
      startWithNewLine: false,
      visible: false,
    },
    {
      type: "text",
      name: "lastName",
      title: "Last Name",
      isRequired: true,
      startWithNewLine: false,
    },
  ],

  onInit() {
    // Add a `showMiddleName` Boolean property to the `fullname` question type
    Serializer.addProperty("fullname", {
      name: "showMiddleName",
      type: "boolean",
      default: false,
      category: "general",
    });
  },
  // Set the Middle Name question visibility at startup
  onLoaded(question) {
    this.changeMiddleNameVisibility(question);
  },
  // Track the changes of the `showMiddleName` property
  onPropertyChanged(question, propertyName, newValue) {
    if (propertyName === "showMiddleName") {
      this.changeMiddleNameVisibility(question);
    }
  },
  changeMiddleNameVisibility(question) {
    const middleName = question.contentPanel.getQuestionByName("middleName");
    if (!!middleName) {
      // Set the `middleName` question's visibility based on the composite question's `showMiddleName` property
      middleName.visible = question.showMiddleName;
    }
  },
});
//Register new "address" component
ComponentCollection.Instance.add({
  name: "shippingaddress",
  title: "Shipping Address",
  elementsJSON: [
    {
      type: "comment",
      name: "businessAddress",
      title: "Business Address",
      isRequired: true,
    },
    {
      type: "boolean",
      name: "shippingSameAsBusiness",
      title: "Shipping address same as business address",
      defaultValue: true,
    },
    {
      type: "comment",
      name: "shippingAddress",
      title: "Shipping Address",
      // Use the `composite` prefix to access a question nested in the composite question
      enableIf: "{composite.shippingSameAsBusiness} <> true",
      isRequired: true,
    },
  ],
  onValueChanged(question, name) {
    const businessAddress =
      question.contentPanel.getQuestionByName("businessAddress");
    const shippingAddress =
      question.contentPanel.getQuestionByName("shippingAddress");
    const shippingSameAsBusiness = question.contentPanel.getQuestionByName(
      "shippingSameAsBusiness"
    );

    if (name === "businessAddress") {
      // If "Shipping address same as business address" is selected
      if (shippingSameAsBusiness.value === true) {
        // Copy the Business Address value to Shipping Address
        shippingAddress.value = businessAddress.value;
      }
    }
    if (name === "shippingSameAsBusiness") {
      // If "Shipping address same as business address" is selected, copy the Business Address to Shipping Address
      // Otherwise, clear the Shipping Address value
      shippingAddress.value =
        shippingSameAsBusiness.value === true ? businessAddress.value : "";
    }
  },
});

const SurveyComponent = ({
  surveyID,
  surveyJson,
  surveyTheme,
  surveyData,
  utm,
  saveSurveyResults,
}) => {
  //Populate UTM on form
  const updateUTM = () => {
    let el = document.getElementById("urn");
    if (el) el.textContent = utm;
  };

  useEffect(() => {
    setTimeout(updateUTM, 500);
  }, []);

  const saveResults = useCallback((sender) => {
    saveSurveyResults(sender.data);
  }, []);

  if (!surveyJson) return <Loader />;
  const survey = new Model(surveyJson);
  survey.applyTheme(surveyTheme);
  if (surveyData) survey.data = surveyData;
  survey.onComplete.add(saveResults);
  const customCss = {
    page: {
      title: "page-title",
    },
  };
  survey.css = customCss;
  //css override for yes/no boolean
  survey.onUpdateQuestionCssClasses.add(function (_, options) {
    const classes = options.cssClasses;
    //classes.root = "question-root";
    if (options.question.getType() === "boolean") {
      classes.root += " question-root-boolean";
    }
  });

  return (
    <div id={`formId_${surveyID}`}>
      <Survey model={survey} />
    </div>
  );
};

export default SurveyComponent;
