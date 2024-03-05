import React, { useState } from 'react';
import { Broadcast, Player, useCreateStream } from "@livepeer/react";
import ChatBox from '../ChatBox/ChatBox';

const Livestream = () => {
    const [streamName, setStreamName] = useState('');
    const [streamData, setStreamData] = useState('');
    const [playbackId, setPlaybackId] = useState('');
    const [streamId, setStreamId] = useState('')
    const [error, setError] = useState('');
    const apiToken = '45cddd3a-e60e-4a8b-b121-e353f8b107b0'
    const {
        mutate: createStream,
        data: createdStream,
        status,
    } = useCreateStream(
        streamName
            ? {
                name: streamName,
            }
            : null
    );

    const handleCreateStream = async () => {
        try {
            setStreamData(createStream())
        } catch (error) {
            setError('Failed to create stream. Please try again.');
            console.error('Error creating stream:', error);
        }
    };
    const handleStopStream = async () => {
        try {
            console.log("Stream id", createdStream.id);
            setStreamId(createdStream.id);
            console.log("Stream id", streamId);
            fetch(`https://livepeer.studio/api/stream/${createdStream.id}/terminate`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${apiToken}` // Don't forget to define apiToken
                }
            })
                .then(response => {
                    if (response.status === 204) {
                        console.log('Livestream terminated successfully');
                    } else {
                        console.error('Failed to terminate livestream');
                    }
                })
                .catch(error => console.error('Error terminating livestream:', error));
        } catch (error) {
            setError('Failed to stop stream. Please try again.');
            console.error('Error Stop stream:', error);
        }
    };


    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Stream Name"
                        value={streamName}
                        onChange={(e) => setStreamName(e.target.value)}
                    />
                    <button
                        className="btn btn-primary btn-block"
                        onClick={handleCreateStream}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? 'Creating Stream...' : 'Create Stream'}
                    </button>
                    <br />
                    <br />
                    <br />
                    <br />
                    <button
                        className="btn btn-danger btn-block"
                        onClick={handleStopStream}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? 'Stoping Stream...' : 'Stoped Stream'}
                    </button>

                    {error && <p className="text-danger mt-3">Error: {error}</p>}
                    {createdStream && streamName && (
                        <div className="mt-3">
                            <p>Stream Created: {createdStream.name}</p>
                            <p>Stream Created playback id: {createdStream.playbackId}</p>
                            <p>Stream Created id: {createdStream.id}</p>

                            <div style={{ width: "100%" }}>
                                <Broadcast
                                    streamKey={createdStream.streamKey}
                                    controls={{ autohide: 3000 }}
                                    onError={(error) => console.log("Error in broadcat = ",error)}
                                // Add any additional configurations for the Broadcast component
                                />
                                <ChatBox chat={streamName}></ChatBox>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Livestream;
