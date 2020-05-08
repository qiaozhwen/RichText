import React, { forwardRef, useState, FC, } from 'react';
import { convertToRaw, CompositeDecorator, Editor, EditorState, convertFromHTML, ContentState } from 'draft-js';
import BlockStyleControl from './BlockStyleControl';
import { FormControl, FormHelperText } from '@material-ui/core';
import FormLabel from '../FormLabel';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { RichUtils } from 'draft-js';

let newlineModal: boolean = false;
const options: any = {
    blockRenderers: {
        unstyled: (block: any) => {
            const data: any = block.getText();
            if (!data) {
                return '<br/>';
            }
        },
    },
};
const checkHData: string[] = ['<br/>', '<h1><br/></h1>', '<h2><br/></h2>', '<h3><br/></h3>', '<h4><br/></h4>', '<h5><br/></h5>', '<h6><br/></h6>'];
let isFocus: boolean = false;
const DraftEditor: FC<any> = forwardRef(({height = 250, onChange, fullWidth, error, required, helperText, label, ...props}: any, ref: any) => {
    console.log('ref', ref);
    const decorator: any = new CompositeDecorator([
        {
            strategy: findImageEntities,
            component: Image,
        },
        {
            strategy: findLinkEntities,
            component: Link,
        }
    ]);
    // const htmlValue = props.value.replace(/<br\/>/g, '<div><br/></div>');
    // console.log('htmaaa', htmlValue)
    // const state = stateFromHTML(htmlValue || ' ');
    // const domBuilder = (html: string) => {
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(html, 'text/html');
    //     console.log('==============================', doc);
    //     return doc.body;
    // };
    // const htmlText = convertFromHTML(props.value, domBuilder);
    // const state = ContentState.createFromBlockArray(htmlText.contentBlocks, htmlText.entityMap);
    // console.log('--------------------------------', htmlText.contentBlocks);
    // console.log('11111111111111111', props.value);

    const blocksFromHTML = convertFromHTML(props.value || ' ');
    const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
    );

    const [editorState, setEditorState] = useState(EditorState.createWithContent(state, decorator));
    const [editorRef, setEditorRef] = useState({
        focus: () => {
        }
    });
    const styles = {
        editorBox: {
            width: '100%',
        },
        editor: {
            height: height + 'px',
            border: '2px solid #F7F8FA'
        }
    };
    const editorStyleMap: any = {
        CODE: {
            backgroundColor: '#F2F2F2'
        }
    };

    function handleChange(editorStateValue: EditorState): void {
        setEditorState(editorStateValue);
        const blockStyle = RichUtils.getCurrentBlockType(editorStateValue);
        if (newlineModal) {
            const newEditState = RichUtils.toggleBlockType(
                editorStateValue,
                blockStyle
            );
            Promise.resolve().then(() => {
                setEditorState(newEditState);
                newlineModal = false;
            });
        }
        const html = stateToHTML(editorStateValue.getCurrentContent(), options);
        submitData(html, editorStateValue);
    }

    function handleReturn(event: any, editorStateValue: any): any {
        event.preventDefault();
        const selectionState = editorStateValue.getSelection();
        const focusOffset = selectionState.getFocusOffset();
        const focusKey = selectionState.getFocusKey();
        const focusRow = convertToRaw(editorStateValue.getCurrentContent());
        const focusData = focusRow.blocks.filter((cur: any) => cur.key == focusKey)[0];
        const blockStyle = editorStateValue.getCurrentContent().getBlockForKey(selectionState.getStartKey()).getType();
        if (focusOffset >= focusData.text.length && (['header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six'].includes(blockStyle))) {
            // 换行
            newlineModal = true;
        } else {
            newlineModal = false;
        }
    }

    function submitData(data: string, _editorStateValue: any): any {
        let result = '';
        if (!checkHData.includes(data)) {
            result = data;
        }
        if (!!result) {
            isFocus = false;
        }
        (!isFocus && onChange) && onChange(result);
    }

    // 行内样式改变
    function onInlineTypeChange(editorState: any): void {
        handleChange(editorState);
    }

    function findLinkEntities(contentBlock: any, callback: any, contentState: any): any {
        contentBlock.findEntityRanges(
            (character: any) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === 'LINK'
                );
            },
            callback
        );
    }

    function findImageEntities(contentBlock: any, callback: any, contentState: any): any {
        contentBlock.findEntityRanges(
            (character: any) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === 'IMAGE'
                );
            },
            callback
        );
    }

    function handleKeyCommand(command: any, editorState: any): any {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            handleChange(newState);
            return 'handled';
        }
        return 'not-handled';
    }

    function handleFocusStatus(): void {
        isFocus = true;
    }

    let className: string = 'editor-content';
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (contentState.getBlockMap().first().getType() !== 'unstyled') {
            className = 'RichEditor-hidePlaceholder';
        }
    }
    // const blockRenderMap = Immutable.Map({
    //     'div': {
    //         element: 'p',
    //     }
    // });
    // const extendedBlockRenderMap = Draft.DefaultDraftBlockRenderMap.merge(blockRenderMap);

    return (
        <FormControl fullWidth={fullWidth} required={required} error={error}>
            <FormLabel>{label}</FormLabel>
            <div style={styles.editorBox} className='RichEditor-root'>
                <BlockStyleControl editorState={editorState} onBlockTypeChange={onInlineTypeChange}
                                   onInlineTypeChange={onInlineTypeChange} editorRef={editorRef}
                                   changeFocus={handleFocusStatus}/>
                <div style={styles.editor} className={className}>
                    <Editor
                        ref={(ref: any) => {
                            setEditorRef(ref);
                        }}
                        placeholder={props.placeholder}
                        onChange={handleChange}
                        handleBeforeInput={() => {
                            isFocus = false;
                            return 'not-handled';
                        }}
                        handleKeyCommand={handleKeyCommand}
                        handleReturn={handleReturn}
                        editorState={editorState}
                        customStyleMap={editorStyleMap}
                        onFocus={() => isFocus = true}
                        readOnly={props.readOnly}/>
                </div>
            </div>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
});
export default DraftEditor;
const Link = (props: any) => {
    const {url} = props.contentState.getEntity(props.entityKey).getData();
    return (
        <a href={url}>
            {props.children}
        </a>
    );
};
const Image = (props: any) => {
    const {height, src, width} = props.contentState.getEntity(props.entityKey).getData();
    return (
        <img src={src} height={height} width={width}/>
    );
};