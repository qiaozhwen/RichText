import React, { ReactNode, Fragment } from 'react';
import { RichUtils } from 'draft-js';
import './StyleControl.css'


const BlockType = [
    {key: 'header-one', styleName: 'header-one', title: 'H1', icontTitle: 'H1'},
    {key: 'header-two', styleName: 'header-two', title: 'H2', icontTitle: 'H2'},
    {key: 'header-three', styleName: 'header-three', title: 'H3', icontTitle: 'H3'},
    {key: 4, styleName: 'header-four', title: 'H4', icontTitle: 'H4'},
    {key: 5, styleName: 'header-five', title: 'H5', icontTitle: 'H5'},
    {key: 6, styleName: 'header-six', title: 'H6', icontTitle: 'H6'},
    {key: 8, styleName: 'unordered-list-item', title: '无序列', icon: 'fa-list-ul', hoverItems: []},
    {key: 9, styleName: 'ordered-list-item', title: '有序列', icon: 'fa-list-ol', hoverItems: []},
];

const InlineType = [
    {key: 1, styleName: 'BOLD', title: '加粗', icon: 'fa-bold'},
    {key: 2, styleName: 'ITALIC', title: '斜体', icon: 'fa-italic'},
    {key: 3, styleName: 'UNDERLINE', title: '下划线', icon: 'fa-underline'}
];
export class StyleControl extends React.Component {

    clickBlock(event, style) {
        event.preventDefault();
        const newEditState = RichUtils.toggleBlockType(
            this.props.editorState,
            style
        );
        this.props.onBlockTypeChange(newEditState);
    }


    clickStyle(event, style) {
        event.preventDefault();
        const newEditState = RichUtils.toggleInlineStyle(
            this.props.editorState,
            style
        );
        this.props.onInlineTypeChange(newEditState);
    }

    render() {
        const editorState = this.props.editorState;
        const selection = editorState.getSelection();
        const blockStyle = editorState.getCurrentContent().getBlockForKey(selection.getFocusKey()).getType();
        const currentStyle = editorState.getCurrentInlineStyle();
        return (
            <div className='draft-icon-box'>
                {InlineType.map((item) => {
                    return (
                        <div
                            key={item.key}
                            className={['draft-icon', currentStyle.has(item.styleName) ? 'activeClass' : ''].join(' ')}
                            onMouseDown={(event) => {
                                this.clickStyle(event, item.styleName);
                            }}>
                            <i className={`fa ${item.icon}`}/>
                        </div>
                    );
                })}
                {BlockType.map((item) => {
                    return (
                        <Fragment key={`main-${item.key}`}>
                            <div
                                key={`item-nohover-${item.key}`}
                                className={['draft-icon', blockStyle === item.styleName ? 'activeClass' : ''].join(' ')}
                                onMouseDown={(event) => {
                                    this.clickBlock(event, item.styleName);
                                }}>
                                {!!item.icon?  <i key={`item-nohover-image-${item.key}`}
                                                  className={`fa ${item.icon} draft-icon-image`}/>: <i key={`item-nohover-image-${item.key}`}>{item.icontTitle}</i>}
                            </div>
                        </Fragment>
                    );
                })}
            </div>
        );
    }
}