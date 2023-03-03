import { MongoClient, ObjectId } from "mongodb";
import Head from 'next/head';

import MeetupDetail from "../../components/meetups/MeetupDetail";

const MeetupDetailsPage = (props) => {
    return <>
        <Head>
            <title>React Meetup - {props.meetupData.title}</title>
            <meta name="description" content={props.meetupData.description} />
        </Head>
        <MeetupDetail image={props.meetupData.image} title={props.meetupData.title} description={props.meetupData.description} address={props.meetupData.address} />
    </>
}

export async function getStaticPaths() {
    const client = await MongoClient.connect('mongodb+srv://yashjain331299:ozDorK6ki9aLKfCw@cluster0.mjcknqw.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        fallback: false,
        paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
    }
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect('mongodb+srv://yashjain331299:ozDorK6ki9aLKfCw@cluster0.mjcknqw.mongodb.net/meetups?retryWrites=true&w=majority');
    const db = client.db();

    const meetupsCollection = db.collection('meetups');
    const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) });

    client.close();

    return {
        props: {
            meetupData: {
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                id: selectedMeetup._id.toString(),
                description: selectedMeetup.description
            }
        }
    }
}

export default MeetupDetailsPage;