import React, {ReactNode, Fragment} from 'react';
import {RichUtils, Modifier, EditorState} from 'draft-js';
import './StyleControl.css';
import {Modal, Button} from 'react-bootstrap';

const emojiString = '😀,😁,🤣,😂,😄,😅,😆,😇,😉,😊,🙂,🙃,😋,😌,😍,😘,😙,😜,😝,🤑,🤓,😎,🤗,🤡,🤠,😏,😶,😑,😒,🙄,🤔,😳,😞,😟,😠,😡,😔,😕,☹,😣,😖,😫,😤,😮,😱,😨,😰,😯,😦,😢,😥,😪,😓,🤤,😭,😲,🤥,🤢,🤧,🤐,😷,🤒,🤕,😴';
const emojis = emojiString.split(',');
console.log(emojis)
const BlockType = [
    {key: 'header-one', styleName: 'header-one', title: 'H1', icontTitle: 'H1'},
    {key: 'header-two', styleName: 'header-two', title: 'H2', icontTitle: 'H2'},
    {key: 'header-three', styleName: 'header-three', title: 'H3', icontTitle: 'H3'},
    {key: 4, styleName: 'header-four', title: 'H4', icontTitle: 'H4'},
    {key: 5, styleName: 'header-five', title: 'H5', icontTitle: 'H5'},
    {key: 6, styleName: 'header-six', title: 'H6', icontTitle: 'H6'},
    {key: 8, styleName: 'unordered-list-item', title: '无序列', icon: 'fa-list-ul'},
    {key: 9, styleName: 'ordered-list-item', title: '有序列', icon: 'fa-list-ol'},
    {key: 11, styleName: 'test1', title: '图片', icon: 'fa-picture-o', noStyle: true},
    {key: 12, styleName: 'test2', title: '超链接', icon: 'fa-link', noStyle: true}
];

const InlineType = [
    {key: 1, styleName: 'BOLD', title: '加粗', icon: 'fa-bold'},
    {key: 2, styleName: 'ITALIC', title: '斜体', icon: 'fa-italic'},
    {key: 3, styleName: 'UNDERLINE', title: '下划线', icon: 'fa-underline'},
    {key: 10, styleName: 'test', title: '表情', icon: 'fa-smile-o', hoverItems: emojis}
];

export class StyleControl extends React.Component<any, any> {
    constructor(props: any){
        super(props);
        this.state= {
            hoverModal: false,
            show: false
        }
    }

    clickBlock(event: any, style: any) {
        event.preventDefault();
        const newEditState = RichUtils.toggleBlockType(
            this.props.editorState,
            style
        );
        this.props.onBlockTypeChange(newEditState);
    }


    clickStyle(event: any, style: any) {
        event.preventDefault();
        const newEditState = RichUtils.toggleInlineStyle(
            this.props.editorState,
            style
        );
        this.props.onInlineTypeChange(newEditState);
    }

    moveStyle () {
        this.setState({
            hoverModal: true
        })
    }

    handleEmojiClick (event: any) {
        const emoji = event.target.innerHTML;
        const {editorState} = this.props;
        const contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            emoji,
            editorState.getCurrentInlineStyle(),
        )
        this.props.onInlineTypeChange(EditorState.push(editorState, contentState, 'insert-characters'))
    }


    handleClose () {
        this.setState({
            show: false
        })
    };
    handleShow () {
        this.setState({
            show: true
        })
    };

    render() {
        const editorState = this.props.editorState;
        const selection = editorState.getSelection();
        const blockStyle = editorState.getCurrentContent().getBlockForKey(selection.getFocusKey()).getType();
        const currentStyle = editorState.getCurrentInlineStyle();
        return (
            <div className='draft-icon-box'>
                <div className={'box-up'}>
                    {BlockType.map((item) => {
                        return (
                            <Fragment key={`main-${item.key}`}>
                                <div
                                    key={`item-nohover-${item.key}`}
                                    className={['draft-icon', blockStyle === item.styleName ? 'activeClass' : ''].join(' ')}
                                    onMouseDown={(event) => {
                                        !!item.noStyle ?  this.handleShow() : this.clickBlock(event, item.styleName);
                                    }}
                                    style={{display: "inline-block"}}>
                                    {!!item.icon ? <i key={`item-nohover-image-${item.key}`}
                                                      className={`fa ${item.icon} draft-icon-image`}/> :
                                        <i key={`item-nohover-image-${item.key}`}>{item.icontTitle}</i>}
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
                <div className={'box-down'}>
                    {InlineType.map((item) => {
                        return (
                            <div
                                key={item.key}
                                className={['draft-icon', currentStyle.has(item.styleName) ? 'activeClass' : ''].join(' ')}
                                onMouseDown={(event) => {
                                    !!item.hoverItems ? '' : this.clickStyle(event, item.styleName);
                                }}
                                onMouseEnter={()=>{
                                    !item.hoverItems ? '' : this.moveStyle();
                                }}
                                onMouseLeave={()=>{
                                    this.setState({
                                        hoverModal: false
                                    })
                                }}
                                style={{display: "inline-block", position: "relative"}}
                            >
                                <i className={`fa ${item.icon}`}/>
                                {!!item.hoverItems && this.state.hoverModal ?
                                    (<Fragment>
                                        <div className={'hover-box'}>
                                            {emojis.map((cur: any)=>{
                                                return (
                                                    <div key={`${cur}-emoji`} onClick={(event)=>{
                                                        this.handleEmojiClick(event)
                                                    }}>{cur}</div>
                                                )
                                            })}
                                        </div>
                                    </Fragment>)
                                    : ''}
                            </div>
                        );
                    })}
                </div>
                <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleClose.bind(this)}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}