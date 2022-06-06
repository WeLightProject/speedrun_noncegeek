import React, { useEffect, useState } from "react";
import { Link as RouteLink, useParams } from "react-router-dom";
import axios from "axios";
import {
  useToast,
  useColorModeValue,
  Box,
  Button,
  Link,
  HStack,
  Text,
  Flex,
  Spacer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Container,
  SimpleGrid,
  GridItem,
  Tag,
  SkeletonText,
  Image,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import BuilderProfileCard from "../components/BuilderProfileCard";
import BuilderProfileChallengesTableSkeleton from "../components/skeletons/BuilderProfileChallengesTableSkeleton";
import { challengeInfo } from "../data/challenges";
import { userFunctionDescription } from "../helpers/constants";
import { BG_BACKEND_URL as bgBackendUrl } from "../constants";
import ChallengeStatusTag from "../components/ChallengeStatusTag";
import { getAcceptedChallenges } from "../helpers/builders";
import useCustomColorModes from "../hooks/useCustomColorModes";
import { getChallengeEventsForUser } from "../data/api";
import { byTimestamp } from "../helpers/sorting";
import DateWithTooltip from "../components/DateWithTooltip";

const BG_FRONTEND_URL = "https://bazaar.buidlguidl.com";

export default function BuilderProfileView({ serverUrl, mainnetProvider, address, userProvider, userRole }) {
  const { builderAddress } = useParams();
  const { primaryFontColor, secondaryFontColor, borderColor, iconBgColor } = useCustomColorModes();
  const [builder, setBuilder] = useState();
  const [challengeEvents, setChallengeEvents] = useState([]);
  const [isLoadingBuilder, setIsLoadingBuilder] = useState(false);
  const [isBuilderOnBg, setIsBuilderOnBg] = useState(false);
  const [isLoadingTimestamps, setIsLoadingTimestamps] = useState(false);
  const toast = useToast({ position: "top", isClosable: true });
  const toastVariant = useColorModeValue("subtle", "solid");
  const challenges = builder?.challenges ? Object.entries(builder.challenges) : undefined;
  const acceptedChallenges = getAcceptedChallenges(builder?.challenges);
  const isMyProfile = builderAddress === address;

  const fetchBuilder = async () => {
    setIsLoadingBuilder(true);
    const fetchedBuilder = await axios.get(serverUrl + `/builders/${builderAddress}`);
    setBuilder(fetchedBuilder.data);

    try {
      await axios.get(bgBackendUrl + `/builders/${builderAddress}`);
    } catch (e) {
      // Builder Not found in BG
      setIsLoadingBuilder(false);
      return;
    }

    setIsBuilderOnBg(true);
    setIsLoadingBuilder(false);
  };

  useEffect(() => {
    fetchBuilder();
    // eslint-disable-next-line
  }, [builderAddress]);

  useEffect(() => {
    if (!builderAddress) {
      return;
    }

    async function fetchChallengeEvents() {
      setIsLoadingTimestamps(true);
      try {
        const fetchedChallengeEvents = await getChallengeEventsForUser(builderAddress);
        setChallengeEvents(fetchedChallengeEvents.sort(byTimestamp).reverse());
        setIsLoadingTimestamps(false);
      } catch (error) {
        toast({
          description: "Can't get challenges metadata. Please try again",
          status: "error",
          variant: toastVariant,
        });
      }
    }
    fetchChallengeEvents();
    // eslint-disable-next-line
  }, [builderAddress]);

  return (
    <Container maxW="container.xl">
      <SimpleGrid gap={14} columns={{ base: 1, xl: 4 }}>
        <GridItem colSpan={1}>
          <BuilderProfileCard
            builder={builder}
            mainnetProvider={mainnetProvider}
            isMyProfile={isMyProfile}
            userProvider={userProvider}
            fetchBuilder={fetchBuilder}
            userRole={userRole}
          />
        </GridItem>
        {isBuilderOnBg ? (
          <GridItem colSpan={{ base: 1, xl: 3 }}>
            <Box borderColor={borderColor} borderWidth={1} p={5}>
              <Flex direction="column" align="center" justify="center">
                <Image src="/assets/bg.png" mb={3} />
                <Text mb={3} fontSize="lg" fontWeight="bold">
                  This builder has upgraded to BuidlGuidl.
                </Text>
                <Button as={Link} href={`${BG_FRONTEND_URL}/builders/${builderAddress}`} isExternal colorScheme="blue">
                  View their profile on Buidlguidl
                </Button>
              </Flex>
            </Box>
          </GridItem>
        ) : (
          <GridItem colSpan={{ base: 1, xl: 3 }}>
            <HStack spacing={4} mb={8}>
              <Flex borderRadius="lg" borderColor={borderColor} borderWidth={1} p={4} w="full" justify="space-between">
                <Flex bg={iconBgColor} borderRadius="lg" w={12} h={12} justify="center" align="center">
                  <InfoOutlineIcon w={5} h={5} />
                </Flex>
                <div>
                  <Text fontSize="xl" fontWeight="medium" textAlign="right">
                    {acceptedChallenges.length}
                  </Text>
                  <Text fontSize="sm" color={secondaryFontColor} textAlign="right">
                    challenges completed
                  </Text>
                </div>
              </Flex>
              <Flex borderRadius="lg" borderColor={borderColor} borderWidth={1} p={4} w="full" justify="space-between">
                <Flex bg={iconBgColor} borderRadius="lg" w={12} h={12} justify="center" align="center">
                  <InfoOutlineIcon w={5} h={5} />
                </Flex>
                <div>
                  <Text fontSize="xl" fontWeight="medium" textAlign="right">
                    {builder?.function ? (
                      <Tag colorScheme={userFunctionDescription[builder?.function].colorScheme} variant="solid">
                        {userFunctionDescription[builder?.function].label}
                      </Tag>
                    ) : (
                      "-"
                    )}
                  </Text>
                  <Text fontSize="sm" color={secondaryFontColor} textAlign="right">
                    Role
                  </Text>
                </div>
              </Flex>
            </HStack>
            <Flex mb={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Challenges
              </Text>
              <Spacer />
            </Flex>
            {isLoadingBuilder && <BuilderProfileChallengesTableSkeleton />}
            {!isLoadingBuilder &&
              (challenges ? (
                <Box overflowX="auto">
                  <Table>
                    {isMyProfile && (
                      <TableCaption>
                        <Button as={RouteLink} colorScheme="blue" to="/">
                          Start a challenge
                        </Button>
                      </TableCaption>
                    )}
                    <Thead>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Contract</Th>
                        <Th>Live Demo</Th>
                        <Th>Updated</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {challenges.map(([challengeId, lastSubmission]) => {
                        if (!challengeInfo[challengeId]) {
                          return null;
                        }
                        const lastEventForChallenge = challengeEvents.filter(
                          event => event.payload.challengeId === challengeId,
                        )[0];
                        return (
                          <Tr key={challengeId}>
                            <Td>
                              <Link as={RouteLink} to={`/challenge/${challengeId}`} fontWeight="700" color="teal.500">
                                {challengeInfo[challengeId].label}
                              </Link>
                            </Td>
                            <Td>
                              {challengeInfo[challengeId].submitItems.includes("contractUrl") ? (<Link
                                // Legacy branchUrl
                                href={lastSubmission.contractUrl || lastSubmission.branchUrl}
                                color="teal.500"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Code
                              </Link>) : (<div>--</div>)}
                            </Td>
                            <Td>
                            {challengeInfo[challengeId].submitItems.includes("deployedUrl") ? (<Link
                                href={lastSubmission.deployedUrl}
                                color="teal.500"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Demo
                              </Link>):(<div>--</div>)}
                            </Td>
                            <Td>
                              {isLoadingTimestamps ? (
                                <SkeletonText noOfLines={1} />
                              ) : (
                                <DateWithTooltip timestamp={lastEventForChallenge?.timestamp} />
                              )}
                            </Td>
                            <Td>
                              <ChallengeStatusTag
                                status={lastSubmission.status}
                                comment={lastSubmission.reviewComment}
                                autograding={lastSubmission.autograding}
                              />
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Flex
                  justify="center"
                  align="center"
                  borderRadius="lg"
                  borderColor={borderColor}
                  borderWidth={1}
                  py={36}
                  w="full"
                >
                  {isMyProfile ? (
                    <Box maxW="xs" textAlign="center">
                      <Text fontWeight="medium" color={primaryFontColor} mb={2}>
                        Start a new challenge
                      </Text>
                      <Text color={secondaryFontColor} mb={4}>
                        Show off your skills. Learn everything you need to build on Ethereum!
                      </Text>
                      <Button as={RouteLink} colorScheme="blue" to="/">
                        Start a challenge
                      </Button>
                    </Box>
                  ) : (
                    <Box maxW="xs" textAlign="center">
                      <Text color={secondaryFontColor} mb={4}>
                        This builder hasn't completed any challenges.
                      </Text>
                    </Box>
                  )}
                </Flex>
              ))}
          </GridItem>
        )}
      </SimpleGrid>
    </Container>
  );
}
