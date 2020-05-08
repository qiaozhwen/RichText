import React, { ReactNode, Fragment } from 'react';
import { IProp } from './type';
import { RichUtils } from 'draft-js';
import Tooltip from '../../Tooltip';

const BlockType: any[] = [
    {
        key: 'all-block', styleName: '', title: '段落', icon: 'fa-header',
        hoverItems: [
            {key: 7, styleName: 'unstyled', title: '正文', icon: 'H'},
            {key: 'header-one', styleName: 'header-one', title: 'H1', icon: 'H1'},
            {key: 'header-two', styleName: 'header-two', title: 'H2', icon: 'H2'},
            {key: 'header-three', styleName: 'header-three', title: 'H3', icon: 'H3'},
            {key: 4, styleName: 'header-four', title: 'H4', icon: 'H4'},
            {key: 5, styleName: 'header-five', title: 'H5', icon: 'H5'},
            {key: 6, styleName: 'header-six', title: 'H6', icon: 'H6'}
        ]
    },
    {key: 8, styleName: 'unordered-list-item', title: '无序列', icon: 'fa-list-ul', hoverItems: []},
    {key: 9, styleName: 'ordered-list-item', title: '有序列', icon: 'fa-list-ol', hoverItems: []},
];

const InlineType: any[] = [
    {key: 1, styleName: 'BOLD', title: '加粗', icon: 'fa-bold'},
    {key: 2, styleName: 'ITALIC', title: '斜体', icon: 'fa-italic'},
    {key: 3, styleName: 'UNDERLINE', title: '下划线', icon: 'fa-underline'}
];
export default class BlockStyleControl extends React.Component<IProp> {

    clickBlock(event: any, style: any): void {
        event.preventDefault();
        if (['header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six'].includes(style)) {
            this.props.changeFocus();
        }
        const newEditState = RichUtils.toggleBlockType(
            this.props.editorState,
            style
        );
        this.props.onBlockTypeChange(newEditState);
    }


    clickStyle(event: any, style: any): void {
        event.preventDefault();
        this.props.changeFocus();
        const newEditState = RichUtils.toggleInlineStyle(
            this.props.editorState,
            style
        );
        this.props.onInlineTypeChange(newEditState);
    }

    render(): ReactNode {
        const editorState = this.props.editorState;
        const selection = editorState.getSelection();
        const blockStyle = editorState.getCurrentContent().getBlockForKey(selection.getFocusKey()).getType();
        const currentStyle = editorState.getCurrentInlineStyle();
        return (
            <div className='draft-icon-box'>
                {BlockType.map((item: any) => {
                    return (
                        <Fragment key={`main-${item.key}`}>
                            {!item.hoverItems.length ? <div
                                    key={`item-nohover-${item.key}`}
                                    className={['draft-icon', blockStyle === item.styleName ? 'activeClass' : ''].join(' ')}
                                    onMouseDown={(event: any) => {
                                        this.clickBlock(event, item.styleName);
                                    }}>
                                    <i key={`item-nohover-image-${item.key}`}
                                       className={`fa ${item.icon} draft-icon-image`}/>
                                </div> :
                                <Tooltip key={`item-toolip-${item.key}`} title={
                                    <Fragment key={`item-fragment-${item.key}`}>
                                        {item.hoverItems.map((cur: any) => {
                                            return (
                                                <div
                                                    key={`hoveritem-${cur.key}`}
                                                    className={['draft-icon', blockStyle === cur.styleName ? 'activeClass' : ''].join(' ')}
                                                    onMouseDown={(event: any) => {
                                                        this.clickBlock(event, cur.styleName);
                                                    }}>
                                                    <i key={`hoveritem-image-${cur.key}`}>{cur.icon}</i>
                                                </div>
                                            );
                                        })}
                                    </Fragment>
                                } interactive>
                                    <div
                                        key={`item-toolip-main-${item.key}`}
                                        className={['draft-icon', item.hoverItems.map((cur: any) => {
                                            return cur.styleName;
                                        }).includes(blockStyle) ? 'activeClass' : ''].join(' ')}>
                                        <i key={`item-image-${item.key}`}
                                           className={`fa ${item.icon} draft-icon-image`}/>
                                    </div>
                                </Tooltip>
                            }
                        </Fragment>
                    );
                })}
                {InlineType.map((item: any) => {
                    return (
                        <div
                            key={item.key}
                            className={['draft-icon', currentStyle.has(item.styleName) ? 'activeClass' : ''].join(' ')}
                            onMouseDown={(event: any) => {
                                this.clickStyle(event, item.styleName);
                            }}>
                            <i className={`fa ${item.icon}`}/>
                        </div>
                    );
                })}
            </div>
        );
    }
}