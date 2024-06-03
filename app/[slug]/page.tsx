import { cookies } from "next/headers";
import {
  getSurveyJson,
  getSurveyData,
  saveSurveyData,
} from "@/app/lib/actions";
import SurveyComponent from "@/app/ui/surveyjs/SurveyComponent";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: any;
}) {
  //Retrive Survey ID and Utm from URL
  const SURVEY_ID = params.slug;
  const UTM = searchParams.utm || cookies().get("utm")?.value;
  console.log("SURVEY_ID & UTM:", SURVEY_ID, UTM);
  //TODO: Set UTM in cookies or session storage

  //Get Form Definition
  const jsonFormDefinition = await getSurveyJson(SURVEY_ID);
  const surveyJson = jsonFormDefinition?.json;
  const surveyTheme = jsonFormDefinition?.theme;
  //Get Survey Data
  const responseJson = await getSurveyData(SURVEY_ID, UTM);
  const surveyData = responseJson?.formData
    ? JSON.parse(responseJson.formData)
    : {};
  //Save Survey Results
  const saveSurveyResults = async (data: any) => {
    "use server";
    const dataId = responseJson && responseJson.id ? responseJson.id : null;
    saveSurveyData(data, SURVEY_ID, UTM, dataId);
  };

  return (
    <main>
      <div className="bg-[#edf6f8] lg:flex m-auto justify-center">
        <div className="md:w-[100%] lg:w-1/2 justify-center">
          <SurveyComponent
            surveyID={SURVEY_ID}
            utm={UTM}
            surveyJson={surveyJson}
            surveyTheme={surveyTheme}
            surveyData={surveyData}
            saveSurveyResults={saveSurveyResults}
          />
        </div>
      </div>
    </main>
  );
}
