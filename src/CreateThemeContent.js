
import React, { useState, useEffect } from 'react';
import { generate } from 'shortid';
import _ from 'lodash';
import { useTheme } from './theme/useTheme';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from '@material-ui/core/Button';
import * as themes from './theme/schema.json';

const CreateThemeContent = props => {

    const defaultTheme = {
        themeName: "",
        bgColor: "#Cf4307",
        txtColor: "#FFFFFF",
        btnBgColor: "#000000",
        btnTxtColor: "#FFFFFF",
        linkColor: "#10BEEA",
        font: "Roboto",
        commentbgcolor: "#b9dcff"

    };
    const { getFonts } = useTheme();
    const [state, setState] = useState(defaultTheme);
    const [newTheme, setNewTheme] = useState({});
    const getThemeObj = () => {
        //const themeObj = {};
      
        if(props.themeType == 'lightTheme'){
            const Theme = themes.data.light
            const lightTheme = {
                themeName: Theme.name,
                bgColor: Theme.colors.body,
                txtColor: Theme.colors.text,
                btnBgColor: Theme.colors.button.background,
                btnTxtColor: Theme.colors.button.text,
                linkColor: Theme.colors.link.text,
                font: Theme.font,
                commentbgcolor:Theme.colors.commentbgcolor
        
            };
            setState({...lightTheme});
            const themeObj = {
                "id": generate(),
                "name": Theme.name,
                "colors": {
                    "body": Theme.colors.body,
                    "text": Theme.colors.text,
                    "button": {
                        "text": Theme.colors.button.text,
                        "background": Theme.colors.button.background
                    },
                    "link": {
                        "text": Theme.colors.link.text,
                        "opacity": 1
                    },
                    "commentbgcolor": Theme.colors.commentbgcolor
                },
                "font": Theme.font
            };
            return themeObj;
            
        }
        else if (props.themeType == 'darkTheme'){
            const Theme = themes.data.dark;
            const darkTheme = {
                themeName: Theme.name,
                bgColor: Theme.colors.body,
                txtColor: Theme.colors.text,
                btnBgColor: Theme.colors.button.background,
                btnTxtColor: Theme.colors.button.text,
                linkColor: Theme.colors.link.text,
                font: Theme.font,
                commentbgcolor:Theme.colors.commentbgcolor
        
            };
            setState({...darkTheme});
            const themeObj = {
                "id": generate(),
                "name": Theme.name,
                "colors": {
                    "body": Theme.colors.body,
                    "text": Theme.colors.text,
                    "button": {
                        "text": Theme.colors.button.text,
                        "background": Theme.colors.button.background
                    },
                    "link": {
                        "text": Theme.colors.link.text,
                        "opacity": 1
                    },
                    "commentbgcolor": Theme.colors.commentbgcolor
                },
                "font": Theme.font
            };
            return themeObj;
        }
        else {
            const themeObj = {
                "id": generate(),
                "name": state.themeName,
                "colors": {
                    "body": state.bgColor,
                    "text": state.txtColor,
                    "button": {
                        "text": state.btnTxtColor,
                        "background": state.btnBgColor
                    },
                    "link": {
                        "text": state.linkColor,
                        "opacity": 1
                    },
                    "commentbgcolor": state.commentbgcolor
                   
                },
                "font": state.font,
                
            };
            return themeObj;
        }
        
    }

    useEffect(() => {
        const updated = getThemeObj();
        setNewTheme({...updated});
    }, []);//state

    const handleChange = evt => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
        console.log('state==>',state)
    }

    const createTheme = () => {
        setState({...defaultTheme});
        const updated = getThemeObj();
        console.log('newupdated==>',updated)
        setNewTheme({...updated});
        props.create({...updated});
        
    }
    

    return(
    <div className="Theme-section">           
                <Form>
                                <Form.Group as={Row} >
                                  <Form.Label column xs="7" htmlFor="themeName">
                                  Theme Name:
                                  </Form.Label>
                                  <Col xs="5">
                                    <Form.Control size="sm"   type="text" 
                                    id="themeName" 
                                    name="themeName" 
                                    value={ state.themeName }
                                    placeholder="Specify a name" 
                                    onChange={ handleChange }
                                    disabled={props.themeType !== ''}/>
                                  </Col>
                                </Form.Group>

                                  <Form.Group as={Row} >
                                  <Form.Label column xs="7" htmlFor="bg_color">
                                  Background Color:
                                  </Form.Label>
                                  <Col xs="5">
                                    <Form.Control size="sm"  className="input-color" type="color" id="bg_color" name="bgColor" value= { state.bgColor } onChange={ handleChange } disabled={props.themeType !== ''}/>
                                  </Col>
                                </Form.Group>

                                <Form.Group as={Row} >
                                  <Form.Label column xs="7" htmlFor="txt_color">
                                  Text Color:
                                  </Form.Label>
                                  <Col xs="5">
                                    <Form.Control size="sm"  className="input-color" type="color" id="txt_color" name="txtColor" value={ state.txtColor } onChange={ handleChange } disabled={props.themeType !== ''}/>
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row} >
                                  <Form.Label column xs="7" htmlFor="btn_bg_color">
                                  Button Background Color:
                                  </Form.Label>
                                  <Col xs="5">
                                    <Form.Control size="sm"  className="input-color" type="color" id="btn_bg_color" name="btnBgColor" value={ state.btnBgColor } onChange={ handleChange } disabled={props.themeType !== ''}/>
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                  <Form.Label column xs="7" htmlFor="btn_txt_color">
                                  Button Text Color:
                                  </Form.Label>
                                  <Col xs="5">
                                    <Form.Control size="sm"  className="input-color" type="color" id="btn_txt_color" name="btnTxtColor" value={ state.btnTxtColor } onChange={ handleChange } disabled={props.themeType !== ''}/>
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                  <Form.Label column xs="7" htmlFor="comment_bg_color">
                                  Comment background Color:
                                  </Form.Label>
                                  <Col xs="5">
                                    <Form.Control size="sm"  className="input-color" type="color" id="comment_bg_color" name="commentbgcolor" value={ state.commentbgcolor } onChange={ handleChange } disabled={props.themeType !== ''}/>
                                    
                                
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row} >
                                  <Form.Label column xs="7" htmlFor="font">
                                  Select a Font:
                                  </Form.Label>
                                  <Col xs="5">
                                    <select name="font" id="font" onChange={ handleChange } value={state.font} disabled={props.themeType !== ''}>
                                    { getFonts().map((font, index) =>
                                        <option value={ font } key={ index }>{ font }</option>
                                    )}
                                </select>
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row}>
                                <Col xs={{ span: 5, offset: 7 }}>
                                <Button className="btn-apply"   onClick={ createTheme } disabled={ state.themeName.trim().length === 0 }>Apply</Button>
                                </Col>
                                </Form.Group>
                     </Form>
           
       
    </div>
    )
};

export default CreateThemeContent;