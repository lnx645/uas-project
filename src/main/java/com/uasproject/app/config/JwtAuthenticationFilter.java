package com.uasproject.app.config;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NoArgsConstructor;

@Component
@NoArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Override
    public void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        System.out.println("WELCOME");
        final String authHeader = request.getHeader("Authorization");
        System.out.println(authHeader);
        filterChain.doFilter(request, response);
        return;
    }
}
