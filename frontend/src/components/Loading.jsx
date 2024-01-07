import { Container, Flex, Heading, Spinner } from '@chakra-ui/react'
import React from 'react'

export default function Loading() {
    return (
        <Container h="100%">
            <Flex justifyContent="center" alignItems="center">
                <Spinner size="xl" />
                <Heading>Loading...</Heading>
            </Flex>
        </Container>
    )
}
