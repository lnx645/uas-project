package com.uasproject.app.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseApi {
    private String status;
    private String token;
}
