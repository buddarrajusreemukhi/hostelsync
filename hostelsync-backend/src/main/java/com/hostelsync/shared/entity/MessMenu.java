package com.hostelsync.shared.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "mess_menu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessMenu extends BaseEntity {

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;

    @Column(name = "breakfast", nullable = false, columnDefinition = "TEXT")
    private String breakfast;

    @Column(name = "lunch", nullable = false, columnDefinition = "TEXT")
    private String lunch;

    @Column(name = "snacks", nullable = false, columnDefinition = "TEXT")
    private String snacks;

    @Column(name = "dinner", nullable = false, columnDefinition = "TEXT")
    private String dinner;

    @Column(name = "special_notes", columnDefinition = "TEXT")
    private String specialNotes;
}
