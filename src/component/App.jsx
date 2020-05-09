import React, {Component} from 'react'
import {Editor, EditorState} from 'draft-js'
import {StyleControl} from './component_modules/StyleControl.jsx'
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
export default class App extends Component{
    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty()};
        this.onChange = editorState => this.setState({editorState});
    }

    onInlineTypeChange(editorState) {
        this.onChange(editorState);
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
                        onChange={this.onChange}
                        editorState={editorState}/>
                </div>
            </div>
        );
    }
}