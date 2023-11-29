/* Copyright (c) 2023-2025
 * This file is part of sep3cs.
 *
 * sep3cs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * sep3cs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with sep3cs. If not, see <http://www.gnu.org/licenses/>.
 */
using DataClash.Application.Common.Exceptions;
using DataClash.Application.Common.Interfaces;
using DataClash.Application.Common.Security;
using DataClash.Domain.Entities;
using DataClash.Domain.Events;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DataClash.Application.Matches.Commands.DeleteMatch
{
    public record DeleteMatchCommand ((long WinnerPlayerId,long LooserPlayerId, DateTime BeginDate) Key) : IRequest;

    [Authorize (Roles = "Administrator")]
    public class DeleteMatchCommandHandler : IRequestHandler<DeleteMatchCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteMatchCommandHandler (IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle (DeleteMatchCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Matches
                .Where (l => l.WinnerPlayerId == request.Key.WinnerPlayerId 
                && l.LooserPlayerId == request.Key.LooserPlayerId 
                && l.BeginDate == request.Key.BeginDate)
                .SingleOrDefaultAsync (cancellationToken)
            ?? throw new NotFoundException (nameof (Match),
             (request.Key.WinnerPlayerId,request.Key.LooserPlayerId,request.Key.BeginDate));

            _context.Matches.Remove (entity);
            //entity.AddDomainEvent (new MatchDeletedEvent (entity));

            await _context.SaveChangesAsync (cancellationToken);
        }
    }
}

