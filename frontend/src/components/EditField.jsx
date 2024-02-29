import {
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls,
  ButtonGroup,
  Text,
  Flex,
  IconButton,
  Input,
  Spacer,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import SearchBar from "./SearchBar";
import { useState } from "react";

export function EditCityField(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [city, setCity] = useState(props.props);
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        {setIsEditing(true)}
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        {setIsEditing(false)}
        <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    );
  }

  const handleCity = (e) => {
    setCity(e);
    props.setCity(e);
  };

  return (
    <Editable
      textAlign="center"
      defaultValue={props.props}
      fontSize="2xl"
      isPreviewFocusable={false}
    >
      <Flex direction={"row"} align={"center"}>
        <EditablePreview />

        {isEditing ? <SearchBar kind={"city"} set={handleCity} /> : null}

        <Spacer />
        <EditableControls />
      </Flex>
    </Editable>
  );
}
export default function EditField(props) {
  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
        <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
      </Flex>
    );
  }

  return (
    <Editable
      textAlign="center"
      defaultValue={props.props}
      fontSize="2xl"
      isPreviewFocusable={false}
    >
      <Flex direction={"row"} align={"center"}>
        <EditablePreview />
        <Input as={EditableInput} onChange={props.onChange} />
        <Spacer />
        <EditableControls />
      </Flex>
    </Editable>
  );
}
