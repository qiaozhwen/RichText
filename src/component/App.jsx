import React, {Component} from 'react'
import {Editor, EditorState, convertToRaw} from 'draft-js'
import {StyleControl} from './component_modules/StyleControl.jsx'
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { RichUtils } from 'draft-js';
import './App.css'
const styles = {
    editorBox: {
        width: '100%',
    },
    editor: {
        height: '200px',
        border: '2px solid #F7F8FA'
    }
};
let newlineModal = false;
const options = {
    blockRenderers: {
        unstyled: (block) => {
            const data = block.getText();
            if (!data) {
                return '<br/>';
            }
        },
    },
};
const editorStyleMap = {
    CODE: {
        backgroundColor: '#F2F2F2'
    }
};
const checkHData = ['<br/>', '<h1><br/></h1>', '<h2><br/></h2>', '<h3><br/></h3>', '<h4><br/></h4>', '<h5><br/></h5>', '<h6><br/></h6>'];
let isFocus = false;
export default class App extends Component{
    constructor(props) {
        super(props);
        const htmlValue = !!props.value ? props.value.replace(/<br\/>/g, '<div><br/></div>'): ' ';
        const state = stateFromHTML(htmlValue);
        this.state = {editorState: EditorState.createWithContent(state)};
    }

    onChange (editorStateValue) {
        this.setState({editorState: editorStateValue})
        const blockStyle = RichUtils.getCurrentBlockType(editorStateValue);
        if (newlineModal) {
            const newEditState = RichUtils.toggleBlockType(
                editorStateValue,
                blockStyle
            );
            Promise.resolve().then(() => {
                this.setState({editorState: newEditState})
                newlineModal = false;
            });
        }
        const html = stateToHTML(editorStateValue.getCurrentContent(), options);
        this.submitData(html, editorStateValue);
    }
    submitData(data, _editorStateValue) {
        let result = '';
        if (!checkHData.includes(data)) {
            result = data;
        }
        if (!!result) {
            isFocus = false;
        }
        (!isFocus && this.props.onChange) && this.props.onChange(result);
    }
    onInlineTypeChange(editorState) {
        this.onChange(editorState);
    }
    handleReturn(event, editorStateValue) {
        event.preventDefault();
        const selectionState = editorStateValue.getSelection();
        const focusOffset = selectionState.getFocusOffset();
        const focusKey = selectionState.getFocusKey();
        const focusRow = convertToRaw(editorStateValue.getCurrentContent());
        const focusData = focusRow.blocks.filter((cur) => cur.key == focusKey)[0];
        const blockStyle = editorStateValue.getCurrentContent().getBlockForKey(selectionState.getStartKey()).getType();
        if (focusOffset >= focusData.text.length && (['header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six'].includes(blockStyle))) {
            // 换行
            newlineModal = true;
        } else {
            newlineModal = false;
        }
    }
    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    render() {
        const editorState = this.state.editorState;
        let className = 'editor-content';
        const contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className = 'RichEditor-hidePlaceholder';
            }
        }
        return (
            <div style={styles.editorBox} className='RichEditor-root'>
                <StyleControl editorState={editorState} onBlockTypeChange={this.onInlineTypeChange.bind(this)}
                                   onInlineTypeChange={this.onInlineTypeChange.bind(this)}/>
                <div style={styles.editor} className={className}>
                    <Editor
                        onChange={this.onChange.bind(this)}
                        editorState={editorState}
                        handleBeforeInput={() => {
                            isFocus = false;
                            return 'not-handled';
                        }}
                        handleKeyCommand={this.handleKeyCommand.bind(this)}
                        handleReturn={this.handleReturn.bind(this)}
                        customStyleMap={editorStyleMap}
                    />
                </div>
            </div>
        );
    }
}