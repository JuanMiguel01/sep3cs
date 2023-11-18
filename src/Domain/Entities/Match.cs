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
using System.ComponentModel.DataAnnotations.Schema;

namespace DataClash.Domain.Entities
{
  public class Match
    {
      public long WinnerPlayerId { get; set; }
      public long LooserPlayerId { get; set; }
      public DateTime BeginDate { get; set; }
      public TimeSpan Duration { get; set; }

      [ForeignKey ("LooserPlayerId")]
      public virtual Player? LooserPlayer { get; set; }

      [ForeignKey ("WinnerPlayerId")]
      public virtual Player? WinnerPlayer { get; set; }
    }
}