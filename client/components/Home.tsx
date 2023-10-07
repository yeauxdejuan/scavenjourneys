import React, {useState, useEffect} from 'react';
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, CardMedia, Typography, Stack } from '@mui/material';
import { StyledCreateJourneyButton } from '../styling/homeStyle';

import Search from './Search'
import { JourneyType } from '@this/types/Journey';
import { User } from '@this/types/User';


const Home: React.FC = () => {

  const navigate = useNavigate();

 //set user state to User or null
 const [user, setUser] = useState<User | null>(null);

 const [journeys, setJourneys] = useState<JourneyType[]>([]);

  useEffect(() => {
    // Fetch the most recently made 20 journeys
    axios.get('/journey/recent')
      .then((response) => {
        setJourneys(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recent journeys:', error);
      });
  }, []);

  //assign Journey to User
  // const assignJourney = () => {
  // if (user && selectedJourney) {
  //   axios.post(`/journey/assign/${selectedJourney.id}`, { userId: user.id })
  //     .then((response) => {
  //       console.log('Journey assigned to user:', response.data);
  //       setSuccessMessage('Journey assigned successfully!');
  //     })
  //     .catch((error) => {
  //       console.error('Error assigning journey to user:', error);
  //       setSuccessMessage('');
  //     });
  // }
  // };

return (
  <Container>
    <br/>
    <Search setJourneys={setJourneys}/>
    <br/>
    <Link to="/create-journey">
      <StyledCreateJourneyButton variant="contained">Create a New Journey</StyledCreateJourneyButton>
    </Link>

    <h1> Pick your Journey</h1>
    <Grid container spacing={2}>
      {/* Display list of journeys */}
      {journeys.map((journey) => (
        <Grid item key={journey.id} xs={12} sm={6} md={4}>
          <Card onClick={() => navigate('/journey',{state:{journey}})}>
            <CardMedia
              component="img"
              alt={journey.name}
              height="140"
              image={journey.img_url}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {journey.name}
                <br/>
                {journey.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);
;
};
// key={journey.id}

export default Home;