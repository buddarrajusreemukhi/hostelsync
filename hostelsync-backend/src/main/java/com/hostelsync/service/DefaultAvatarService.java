package com.hostelsync.service;

import com.hostelsync.entity.Gender;
import org.springframework.stereotype.Service;

@Service
public class DefaultAvatarService {

    /**
     * Returns null for default users so no stock/default avatar image is displayed.
     * Only uploaded custom photos will be rendered as images.
     */
    public String getDefaultAvatarUrl(Gender gender) {
        return null;
    }
}
