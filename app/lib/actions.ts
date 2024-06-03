"use server";

// Get survey form definition
export async function getSurveyJson(SURVEY_ID: string) {
  if (!SURVEY_ID) return;
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/formDefinitions/${SURVEY_ID}`
    );
    const jsonResponse = await response.json();
    const jsonFormDefinition = JSON.parse(jsonResponse.formDefinition);
    //console.log("getSurveyJson::", jsonFormDefinition);
    return jsonFormDefinition;
  } catch (err) {
    console.log("Error in loding form definition!!");
    return null;
  }
}
// Restore survey results /api/formDatas/search?formId=10003&utm=123123
export async function getSurveyData(SURVEY_ID: string, UTM: string) {
  if (!SURVEY_ID || !UTM) return;
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/formDatas/search?formId=${SURVEY_ID}&utm=${UTM}`
    );
    const responseJson = await response.json();
    //console.log("getSurveyData::", responseJson);
    return responseJson;
  } catch (err) {
    console.log("Error in loding form data!!", err);
  }
}
export async function saveSurveyData(
  json: any,
  surveyId: string,
  uid: string,
  dataId: string
) {
  const dataStr = JSON.stringify(json);
  const data = { formData: dataStr, formId: surveyId, utm: uid };
  const url = dataId
    ? `${process.env.API_URL}/api/formDatas/${dataId}`
    : `${process.env.API_URL}/api/formDatas`;
  fetch(url, {
    method: dataId ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        // Handle success
      } else {
        // Handle error
      }
    })
    .catch((error) => {
      // Handle error
    });
}
export async function uploadFiles(formData: any) {
  //fetch("https://api.surveyjs.io/private/Surveys/uploadTempFiles", {
  const response = await fetch(`${process.env.API_URL}/fileUpload/add`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data;
}
