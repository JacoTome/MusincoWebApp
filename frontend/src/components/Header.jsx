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
import { Navigate } from "react-router-dom";
export default function Header(props) {
  return (
    <>
      {props.user.username === "" ? <Navigate to="/login" /> : null}
      <Container maxW="container.xl" padding="4">
        <Flex>
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/profile">Profile</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Spacer />
          <Box>
            <Menu>
              <MenuButton as={Button}>
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
