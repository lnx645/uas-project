package com.uasproject.app.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "poll_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PollOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Posts post;

    @Column(name = "label", nullable = false, length = 200)
    private String label;

    @Column(name = "votes_count", nullable = false)
    @Builder.Default
    private Integer votesCount = 0;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "poll_votes",
        joinColumns = @JoinColumn(name = "poll_option_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    private List<User> voters = new ArrayList<>();
}