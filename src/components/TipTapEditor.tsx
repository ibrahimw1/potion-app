"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import { useCompletion } from "ai/react";

type Props = {note: NoteType}

const TipTapEditor = ({note}: Props) => {
    const [editorState, setEditorState] = React.useState(note.editorState || `<h1>${note.name}</h1>`);
    const [predictedLanguage, setPredictedLanguage] = React.useState(null);
    
    const predictLanguage = async () => {
      try {
        const response = await axios.post("/predict_language", {
          text: note.name, // Use note.name as the input text
        });
        setPredictedLanguage(response.data.predicted_language);
      } catch (error) {
        console.error("Error predicting language:", error);
      }
    };
  
    const { complete, completion } = useCompletion({
        api: "/api/completion",
      });
    
    const saveNote = useMutation({
        mutationFn: async () => {
          const response = await axios.post("/api/saveNote", {
            noteId: note.id,
            editorState,
          });
          return response.data;
        },
      });  

      const handleAutocomplete = () => {
        // Check if editor is truthy
        if (editor) {
          // take the last 30 words
          const prompt = editor.getText().split('').slice(-30).join("");
          complete(prompt);
        }
      };
      
      const customText = Text.extend({
        addKeyboardShortcuts() {
          return {
            "Shift-Tab": () => {
              // take the last 30 words
              const prompt = this.editor.getText().split('').slice(-30).join("")
              complete(prompt);
              return true;
            },
          };
        },
      });
    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        onUpdate: ({editor}) => {
            setEditorState(editor.getHTML());
        }, 
    })
    const debouncedEditorstate = useDebounce(editorState, 500)
React.useEffect(() => {
    //save to db
    if(debouncedEditorstate === '') return
    saveNote.mutate(undefined, {
        onSuccess: data => {
            console.log('success update!', data)
        },
        onError: err => {
            console.error(err)
        }
    })
    console.log(debouncedEditorstate);
}, [debouncedEditorstate])

    const lastCompletion = React.useRef("");

    React.useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
    }, [completion, editor]);

    React.useEffect(() => {
      if (debouncedEditorstate !== '') {
        predictLanguage();
      }
    }, [debouncedEditorstate]);

    return (
      <>
        <div className="flex items-center">
          <img
            src="https://cdn3.emoji.gg/emojis/6197-purple-potion.png"
            alt="Logo"
            className="w-6 h-6 mr-2 cursor-pointer" // Added cursor-pointer for hover effect
            onClick={handleAutocomplete}
          />
          {editor && <TipTapMenuBar editor={editor} />}
          <div className="ml-auto">
            <Button disabled variant={"outline"}>
              {saveNote.isPending ? "Saving..." : "Saved"}
            </Button>
          </div>
        </div>
        <div className='prose prose-sm w-full mt-4'>
          <EditorContent editor={editor} />
        </div>
        <div className="h-4"></div>
        <span className="text-sm">
  Tip: Press{" "}
  <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
    Shift + Tab
  </kbd>{" "}
  or click the <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>potion</span> above to trigger AI autocomplete
</span>
      
        <div className="mt-2 text-sm text-gray-600">
          Language: {predictedLanguage || "English"}
        </div>
      </>
    );
  };
  
  export default TipTapEditor;