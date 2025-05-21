import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Code2,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CreateProblemForm = () => {
  const [expandedLang, setExpandedLang] = useState<Partial<Record<keyof Languages, boolean>>>({});
  const { register, control, handleSubmit, setValue} = useForm({
    defaultValues: {
      title: "",
      description: "",
      difficulty: "",
      tags: [],
      testCases: [{ input: "", output: "" }],
      languages: {
        JAVASCRIPT: {
          starterCode: "",
          referenceSolution: "",
          example: {
            input: "",
            output: "",
            explanation: ""
          }
        },
        PYTHON: {
          starterCode: "",
          referenceSolution: "",
          example: {
            input: "",
            output: "",
            explanation: ""
          }
        },
        JAVA: {
          starterCode: "",
          referenceSolution: "",
          example: {
            input: "",
            output: "",
            explanation: ""
          }
        }
      },
      constraints: "",
      hints: "",
      editorial: ""
    }
  });

  const { fields: testCaseFields, append } = useFieldArray({
    control,
    name: "testCases"
  });

  interface ToggleLangFn {
    (lang: keyof Languages): void;
  }

  const toggleLang: ToggleLangFn = (lang) => {
    setExpandedLang((prev) => ({ ...prev, [lang]: !prev[lang] }));
  };

  interface Example {
    input: string;
    output: string;
    explanation: string;
  }

  interface LanguageFields {
    starterCode: string;
    referenceSolution: string;
    example: Example;
  }

  interface Languages {
    JAVASCRIPT: LanguageFields;
    PYTHON: LanguageFields;
    JAVA: LanguageFields;
  }

  interface TestCase {
    input: string;
    output: string;
  }

  interface CreateProblemFormValues {
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
    testCases: TestCase[];
    languages: Languages;
    constraints: string;
    hints: string;
    editorial: string;
  }

 

  const onSubmit = async(data: CreateProblemFormValues) => {
    console.log("Form Data:", data);
    if(data.tags){
      data.tags = `[${data.tags}]`
    }
  try {
     const response =  await axios.post("http://localhost:3000/api/v1/problem/create", data, {
        withCredentials: true,
      })
      console.log("Response:", response.data);
  } catch (error) {
    console.error(error);
    
  }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#131212] rounded-2xl shadow-md p-8 space-y-10 shadow-blue-400 border border-blue-400"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <FileText className="w-6 h-6 text-blue-500" />
          Create New Problem
        </h1>

        {/* Title */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-xl">Title</Label>
          <Input {...register("title")} 
          className="bg-zinc-900 text-white border border-gray-500"
          placeholder="Problem Title"
           />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-xl">Description</Label>
          <Textarea {...register("description")} rows={5} className="bg-zinc-900 text-white border border-gray-500" />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-xl">Difficulty</Label>
          <Select onValueChange={(value) => setValue("difficulty", value)}>
            <SelectTrigger className="bg-zinc-900 text-white border border-gray-500">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white">
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-xl">Tags</Label>
          <Input {...register("tags")} className="bg-zinc-900 text-white border border-gray-500" placeholder="Comma-separated tags" />
        </div>

        {/* Test Cases */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-5 h-5" /> Test Cases
            </h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ input: "", output: "" })}
              className="text-white border-white"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Test Case
            </Button>
          </div>

          {testCaseFields.map((field, index) => (
            <div key={field.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 space-y-2">
              <Textarea {...register(`testCases.${index}.input`)} placeholder="Input" className="bg-zinc-900 text-white border border-gray-500" />
              <Textarea {...register(`testCases.${index}.output`)} placeholder="Expected Output" className="bg-zinc-900 text-white border border-gray-500" />
            </div>
          ))}
        </div>

        {/* Languages */}
        {(["JAVASCRIPT", "PYTHON", "JAVA","CPP"] as (keyof Languages)[]).map((lang) => (
                  <div key={lang} className="space-y-4">
                    <button
                      type="button"
                      onClick={() => toggleLang(lang)}
                      className="w-full flex justify-between items-center bg-zinc-800 px-4 py-3 rounded-lg border border-zinc-700"
                    >
                      <span className="text-lg font-semibold flex items-center gap-2 text-blue-300">
                        <Code2 className="w-5 h-5" /> {lang}
                      </span>
                      {expandedLang[lang] ? <ChevronUp /> : <ChevronDown />}
                    </button>
        
                    {expandedLang[lang] && (
                      <div className="space-y-6">
                        {/* Starter Code */}
                        <div>
                          <h4 className="text-white font-semibold mb-2">Starter Code</h4>
                          <Editor
                            height="200px"
                            language={lang.toLowerCase()}
                            theme="vs-dark"
                            defaultValue=""
                            onChange={(value) => setValue(`languages.${lang}.starterCode`, value || "")}
                          />
                        </div>
        
                        {/* Reference Solution */}
                        <div>
                          <h4 className="text-green-400 font-semibold mb-2">Reference Solution</h4>
                          <Editor
                            height="200px"
                            language={lang.toLowerCase()}
                            theme="vs-dark"
                            defaultValue=""
                            onChange={(value) => setValue(`languages.${lang}.referenceSolution`, value || "")}
                          />
                        </div>
        
                        {/* Example */}
                        <div className="space-y-2">
                          <Label className="text-gray-300">Example Input</Label>
                          <Textarea {...register(`languages.${lang}.example.input`)} className="bg-zinc-900 text-white border border-gray-500" />
                          <Label className="text-gray-300">Example Output</Label>
                          <Textarea {...register(`languages.${lang}.example.output`)} className="bg-zinc-900 text-white border border-gray-500" />
                          <Label className="text-gray-300">Explanation</Label>
                          <Textarea {...register(`languages.${lang}.example.explanation`)} className="bg-zinc-900 text-white border border-gray-500" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

        {/* Constraints, Hints, Editorial */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Constraints</Label>
            <Textarea {...register("constraints")} rows={3} className="bg-zinc-900 text-white border border-gray-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Hints</Label>
            <Textarea {...register("hints")} rows={3} className="bg-zinc-900 text-white border border-gray-500" />
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Editorial</Label>
            <Textarea {...register("editorial")} rows={4} className="bg-zinc-900 text-white border border-gray-500" />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <Button type="submit" className="w-full gap-2 text-white bg-blue-600 hover:bg-blue-700">
            <CheckCircle2 className="w-5 h-5" />
            Create Problem
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblemForm;
