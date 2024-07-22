import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from "styled-components";
import WebFont from 'webfontloader';
import { GlobalStyles } from './theme/GlobalStyles';
import { useTheme } from './theme/useTheme';
import Themedialog from './ThemeDialog';
import CreateThemeContent from './CreateThemeContent';
import InvertColors from '@material-ui/icons/InvertColors';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

export default function Customtheme(props) {
    const { theme, themeLoaded, setMode, getFonts } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState(theme);
    const [showDialog, setShowDialog] = useState(false);
    const [newTheme, setNewTheme] = useState();
    const [key, setKey] = useState('light theme');
    // 2: Create a container
    const Container = styled.div`
  margin: 5px auto 5px auto;
`;
    useEffect(() => {
        WebFont.load({
            google: {
                families: getFonts()
            }
        });

    });

    useEffect(() => {
        console.log("apptheme", theme)
        setSelectedTheme(theme);
    }, [themeLoaded, theme,newTheme]); 

    const manageDialog = () => {
        setShowDialog(!showDialog);
        
    }

    const createTheme = newTheme => {
        console.log("newTheme", newTheme);
        setShowDialog(false);
        setNewTheme(newTheme);
        setMode(newTheme);

    }
    return (
        <>
            {
                themeLoaded && <ThemeProvider theme={selectedTheme}>
                    <GlobalStyles />
                    <InvertColors className="Manage_Theme" onClick={ manageDialog} title="Edit Theme"></InvertColors>
                    <Container style={{ fontFamily: selectedTheme.font }}>
                        <Themedialog 
                            header="Theme"
                            body={
                                <React.Fragment>
                                    <Tabs>
                                        <TabList>
                                        <Tab>Light Theme</Tab>
                                        <Tab>Dark Theme</Tab>
                                        <Tab>Custom</Tab>
                                        </TabList>
                                        <TabPanel>
                                        <CreateThemeContent create={createTheme} themeType='lightTheme' />
                                        </TabPanel>
                                        <TabPanel>
                                        <CreateThemeContent create={createTheme} themeType='darkTheme' />
                                        </TabPanel>
                                        <TabPanel>
                                        <CreateThemeContent create={createTheme} themeType='' />
                                        </TabPanel>
                                    </Tabs>
                                </React.Fragment>
                            }
                            open={showDialog}
                            callback={manageDialog} />
                    </Container>
                </ThemeProvider>

            }
        </>
    );

}