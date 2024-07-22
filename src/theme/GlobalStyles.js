import { createGlobalStyle} from "styled-components";

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.body};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font};
    transition: all 0.50s linear;
  }

  a {
    color: ${({ theme }) => theme.colors.link.text};
    cursor: pointer;
  }

  button {
    border: 0;
    display: inline-block;
    padding: 4px 14px;
    font-size: 14px;
    border-radius: 4px;
    margin-top: 5px;
    cursor: pointer;
    background-color: #1064EA;
    color: #FFFFFF;
    font-family: ${({ theme }) => theme.font};
  }

  button.btn,button.btn:hover {
    background-color: ${({ theme }) => theme.colors.button.background};
    color: ${({ theme }) => theme.colors.button.text};
  }

  .Manage_Theme { 
    // background-color: ${({ theme }) => theme.colors.button.background};
    //color: ${({ theme }) => theme.colors.button.text};
    cursor:pointer
  }

  .form-control-plaintext{
    color: ${({ theme }) => theme.colors.text};
  }
  .comments-list{
    background-color: ${({ theme }) => theme.colors.commentbgcolor};
  }
  .selected-comment {
    background-color: ${({ theme }) => theme.colors.commentbgcolor};
    border: 2px solid ${({ theme }) => theme.colors.commentbgcolor};
    opacity:0.8;
}
.custom-dialog .MuiCheckbox-colorPrimary.Mui-checked {
  color: ${({ theme }) => theme.colors.button.background}
}
`;
