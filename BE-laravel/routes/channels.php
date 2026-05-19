<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Register all of the event broadcasting channels that your application
| supports. The given channel authorization callbacks are used to check
| if an authenticated user can listen on the channel.
|
*/

/**
 * Private channel for individual user notifications
 * Only the user with the matching ID can listen
 */
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

/**
 * Private channel for admin notifications
 * Only users with admin role can listen
 */
Broadcast::channel('admin', function ($user) {
    return $user->role === 'admin';
});
