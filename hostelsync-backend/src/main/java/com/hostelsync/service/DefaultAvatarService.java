package com.hostelsync.service;

import com.hostelsync.shared.enums.Gender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DefaultAvatarService {

    @Value("${hostelsync.default-avatars.male-url:/assets/avatars/default-male.webp}")
    private String maleAvatarUrl;

    @Value("${hostelsync.default-avatars.female-url:/assets/avatars/default-female.webp}")
    private String femaleAvatarUrl;

    @Value("${hostelsync.default-avatars.neutral-url:/assets/avatars/default-neutral.webp}")
    private String neutralAvatarUrl;

    public String getDefaultAvatarUrl(Gender gender) {
        if (gender == null) {
            return neutralAvatarUrl;
        }

        return switch (gender) {
            case MALE -> maleAvatarUrl;
            case FEMALE -> femaleAvatarUrl;
            case OTHER, PREFER_NOT_TO_SAY -> neutralAvatarUrl;
        };
    }
}