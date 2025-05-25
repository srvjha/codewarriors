import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Code2,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Minus,
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
  SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { Toast, ToastSuccess } from "@/utils/ToastContainers";
import { useNavigate } from "react-router-dom";
import type {
  CreateProblemFormValues,
  Languages,
  ToggleLangFn,
} from "@/redux/slices/createProblem/createProblemTypes";
import { CreateProblemResolver } from "@/utils/ZodResolver";

const CreateProblemForm = () => {
  const [expandedLang, setExpandedLang] = useState<
    Partial<Record<keyof Languages, boolean>>
  >({});
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateProblemFormValues>({
    resolver: CreateProblemResolver,
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const navigate = useNavigate();

  const {
    fields: examplesFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    control,
    name: "examples",
  });

  const toggleLang: ToggleLangFn = (lang) => {
    setExpandedLang((prev) => ({ ...prev, [lang]: !prev[lang] }));
  };

  const onSubmit = async (data: CreateProblemFormValues) => {
    if (typeof data.tags === "string") {
      data.tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/problem/create",
        {
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          tags: data.tags,
          examples: data.examples,
          constraints: data.constraints,
          hints: data.hints,
          testcases: data.testcases,
          codeSnippets: {
            JAVASCRIPT: data.languages.JAVASCRIPT.starterCode,
          },
          referenceSolutions: {
            JAVASCRIPT: data.languages.JAVASCRIPT.referenceSolution,
          },
          editorial: data.editorial,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Response:", response.data);
      if (response.status === 200) {
        ToastSuccess(response.data.message);
        // Reset the form or redirect as needed
        reset();
        navigate("/problemset");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Toast />
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
            <Input
              {...register("title")}
              className="bg-zinc-900 text-white border border-gray-500"
              placeholder="Enter Problem Title"
            />
            {errors?.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-xl">Description</Label>
            <Textarea
              {...register("description")}
              rows={5}
              className="bg-zinc-900 text-white border border-gray-500"
              placeholder="Enter Problem Description"
            />
            {errors?.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
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
            {errors?.difficulty && (
              <p className="text-red-500">{errors.difficulty.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-gray-300 text-xl">Tags</Label>
            <Input
              {...register("tags")}
              className="bg-zinc-900 text-white border border-gray-500"
              placeholder="Comma-separated tags"
            />
            {errors?.tags && (
              <p className="text-red-500">{errors.tags.message}</p>
            )}
          </div>

          {/* Examples */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" /> Examples
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendExample({ input: "", output: "", explanation: "" })
                }
                className="text-white border-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Examples
              </Button>
            </div>

            {examplesFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 space-y-2"
              >
                <div className=" flex justify-end">
                  <Minus
                    className="bg-gray-800 rounded-md p-1 cursor-pointer hover:bg-gray-700"
                    onClick={() => removeExample(1)}
                  />
                </div>
                <Textarea
                  {...register(`examples.${index}.input`)}
                  placeholder="Input"
                  className="bg-zinc-900 text-white border border-gray-500"
                />
                <Textarea
                  {...register(`examples.${index}.output`)}
                  placeholder="Expected Output"
                  className="bg-zinc-900 text-white border border-gray-500"
                />
                <Textarea
                  {...register(`examples.${index}.explanation`)}
                  placeholder="Explanation"
                  className="bg-zinc-900 text-white border border-gray-500"
                />
              </div>
            ))}
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
                onClick={() => appendTestCase({ input: "", output: "" })}
                className="text-white border-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Test Case
              </Button>
            </div>

            {testCaseFields.map((field, index) => (
              <div
                key={field.id}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 space-y-2"
              >
                <div className=" flex justify-end">
                  <Minus
                    className="bg-gray-800 rounded-md p-1 cursor-pointer hover:bg-gray-700"
                    onClick={() => removeTestCase(1)}
                  />
                </div>
                <Textarea
                  {...register(`testcases.${index}.input`)}
                  placeholder="Input"
                  className="bg-zinc-900 text-white border border-gray-500"
                />
                <Textarea
                  {...register(`testcases.${index}.output`)}
                  placeholder="Expected Output"
                  className="bg-zinc-900 text-white border border-gray-500"
                />
              </div>
            ))}
            {errors?.testcases && (
              <p className="text-red-500">{errors.testcases.message}</p>
            )}
          </div>

          {/* Languages */}
          {(["JAVASCRIPT", "PYTHON", "JAVA", "CPP"] as (keyof Languages)[]).map(
            (lang) => (
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
                      <h4 className="text-white font-semibold mb-2">
                        Starter Code
                      </h4>
                      <Editor
                        height="200px"
                        language={lang.toLowerCase()}
                        theme="vs-dark"
                        defaultValue=""
                        onChange={(value) =>
                          setValue(`languages.${lang}.starterCode`, value || "")
                        }
                      />
                      <p className="text-red-500">
                        {errors?.languages?.[lang]?.starterCode?.message}
                      </p>
                    </div>

                    {/* Reference Solution */}
                    <div>
                      <h4 className="text-green-400 font-semibold mb-2">
                        Reference Solution
                      </h4>
                      <Editor
                        height="200px"
                        language={lang.toLowerCase()}
                        theme="vs-dark"
                        defaultValue=""
                        onChange={(value) =>
                          setValue(
                            `languages.${lang}.referenceSolution`,
                            value || ""
                          )
                        }
                      />
                      <p className="text-red-500">
                        {errors?.languages?.[lang]?.referenceSolution?.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          )}

          {/* Constraints, Hints, Editorial */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Constraints</Label>
              <Textarea
                {...register("constraints")}
                rows={3}
                className="bg-zinc-900 text-white border border-gray-500"
                placeholder="Enter Constraints"
              />
              {errors?.constraints && (
                <p className="text-red-500">{errors.constraints.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Hints</Label>
              <Textarea
                {...register("hints")}
                rows={3}
                className="bg-zinc-900 text-white border border-gray-500"
                placeholder="Enter Hints"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Editorial</Label>
              <Textarea
                {...register("editorial")}
                rows={4}
                className="bg-zinc-900 text-white border border-gray-500"
                placeholder="Enter Editorial"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <Button
              type="submit"
              className="w-full gap-2 text-white bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle2 className="w-5 h-5" />
              Create Problem
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProblemForm;
