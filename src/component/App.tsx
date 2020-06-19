import React, {Component} from 'react'
import {Editor, EditorState, convertToRaw} from 'draft-js'
import {StyleControl} from './component_modules/StyleControl'
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
const options: any = {
    blockRenderers: {
        unstyled: (block: any) => {
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
// const checkHData = ['<br/>', '<h1><br/></h1>', '<h2><br/></h2>', '<h3><br/></h3>', '<h4><br/></h4>', '<h5><br/></h5>', '<h6><br/></h6>'];
let isFocus = false;
export default class App extends Component<any, any>{
    constructor(props: any) {
        super(props);
        const htmlValue = !!props.value ? props.value.replace(/<br\/>/g, '<div><br/></div>'): ' ';
        const state = stateFromHTML(htmlValue || ' ');
        this.state = {editorState: EditorState.createWithContent(state)};
    }

    onChange (editorStateValue: any) {
        this.setState({editorState: editorStateValue});
        const blockStyle = RichUtils.getCurrentBlockType(editorStateValue);
        if (newlineModal) {
            const newEditState = RichUtils.toggleBlockType(
                editorStateValue,
                blockStyle
            );
            Promise.resolve().then(() => {
                this.setState({editorState: newEditState});
                newlineModal = false;
            });
        }
        const html = stateToHTML(editorStateValue.getCurrentContent(), options);
        console.log('aaaaaaaaaaaa', html);
        this.submitData(html);
    }
    submitData(data: any) {
        // let result = '';
        // if (!checkHData.includes(data)) {
        // }
        // result = data;
        if (!!data) {
            isFocus = false;
        }
        (!isFocus && this.props.onChange) && this.props.onChange(data);
    }
    onInlineTypeChange(editorState: any) {
        this.onChange(editorState);
    }
    handleReturn(event: any, editorStateValue: any): any {
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
        return 'not-handled'
    }
    handleKeyCommand(command: any, editorState: any) {
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
                        customStyleMap={editorStyleMap}
                    />
                </div>
            </div>
        );
    }
}