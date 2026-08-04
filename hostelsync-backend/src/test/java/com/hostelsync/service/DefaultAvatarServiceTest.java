package com.hostelsync.service;

import com.hostelsync.shared.enums.Gender;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DefaultAvatarServiceTest {

    @Test
    void returnsConfiguredAvatarUrlsForEachGender() {
        DefaultAvatarService service = new DefaultAvatarService();
        ReflectionTestUtils.setField(service, "maleAvatarUrl", "/assets/avatars/default-male.webp");
        ReflectionTestUtils.setField(service, "femaleAvatarUrl", "/assets/avatars/default-female.webp");
        ReflectionTestUtils.setField(service, "neutralAvatarUrl", "/assets/avatars/default-neutral.webp");

        assertEquals("/assets/avatars/default-male.webp", service.getDefaultAvatarUrl(Gender.MALE));
        assertEquals("/assets/avatars/default-female.webp", service.getDefaultAvatarUrl(Gender.FEMALE));
        assertEquals("/assets/avatars/default-neutral.webp", service.getDefaultAvatarUrl(Gender.OTHER));
        assertEquals("/assets/avatars/default-neutral.webp", service.getDefaultAvatarUrl(null));
    }
}
