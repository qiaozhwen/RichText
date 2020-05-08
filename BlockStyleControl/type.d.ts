import { EditorState } from 'draft-js';

export interface IProp {
    editorState: EditorState;
    editorRef: any;

    changeFocus(): void;

    onBlockTypeChange(editorState: EditorState): void;

    onInlineTypeChange(editorState: EditorState): void;
}