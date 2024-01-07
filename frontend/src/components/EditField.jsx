import {
    Editable,
    EditablePreview,
    EditableInput,
    useEditableControls,
    ButtonGroup,
    Flex,
    IconButton,
    Input,
    Spacer,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
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
        < Editable
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
        </Editable >
    );
}
