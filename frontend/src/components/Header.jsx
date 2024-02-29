import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import { Container } from "@chakra-ui/react";
import AuthService from "../services/auth.service";
export default function Header(props) {
  return (
    <>
      {/* {props.user.username === "" ? <Navigate to="/singin" /> : null} */}
      <Container maxW="container.xl" padding="4">
        <Flex alignItems={"center"}>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">
                <a href="/home">Home</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile">
                <a href="/profile">Profile</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">
                <a href="/settings">Settings</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/chat">
                <a href="/chat">Chats</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Spacer />
          <Box>
            <Menu>
              <MenuButton
                as={Button}
                bg="#B4656F"
                color="#FBFAF5"
                _hover={{ bg: "#EF767A", color: "#FBFAF5" }}
                _active={{ bg: "#EF767A", color: "#FBFAF5" }}
              >
                {props.user.username} - {props.user.id}
              </MenuButton>
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem
                  onClick={() => {
                    AuthService.logout();
                    window.location.reload();
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
